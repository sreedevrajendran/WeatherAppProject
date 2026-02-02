import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Helper to get or create session ID
async function getSessionId(request: NextRequest): Promise<string> {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('weather_session')?.value;

    if (!sessionId) {
        sessionId = uuidv4();
    }

    return sessionId;
}

// GET /api/settings - Fetch user settings
export async function GET(request: NextRequest) {
    try {
        const sessionId = await getSessionId(request);

        let settings = await prisma.userSettings.findUnique({
            where: { sessionId },
        });

        // If no settings exist, create default settings
        if (!settings) {
            settings = await prisma.userSettings.create({
                data: { sessionId },
            });
        }

        // Parse JSON fields
        const response = {
            units: settings.units,
            updatePeriod: settings.updatePeriod,
            widgets: JSON.parse(settings.widgets),
            activities: JSON.parse(settings.activities),
            savedLocations: JSON.parse(settings.savedLocations),
        };

        const res = NextResponse.json(response);
        res.cookies.set('weather_session', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });

        return res;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// POST /api/settings - Update user settings
export async function POST(request: NextRequest) {
    try {
        const sessionId = await getSessionId(request);
        const body = await request.json();

        const { units, updatePeriod, widgets, activities, savedLocations } = body;

        // Update or create settings
        const settings = await prisma.userSettings.upsert({
            where: { sessionId },
            update: {
                units: units || undefined,
                updatePeriod: updatePeriod || undefined,
                widgets: widgets ? JSON.stringify(widgets) : undefined,
                activities: activities ? JSON.stringify(activities) : undefined,
                savedLocations: savedLocations ? JSON.stringify(savedLocations) : undefined,
            },
            create: {
                sessionId,
                units: units || 'metric',
                updatePeriod: updatePeriod || 1,
                widgets: widgets ? JSON.stringify(widgets) : undefined,
                activities: activities ? JSON.stringify(activities) : undefined,
                savedLocations: savedLocations ? JSON.stringify(savedLocations) : undefined,
            },
        });

        const res = NextResponse.json({ success: true });
        res.cookies.set('weather_session', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });

        return res;
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
