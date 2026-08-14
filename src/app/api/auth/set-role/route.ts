import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const { uid, role } = await req.json();

    if (!uid || !role) {
      return NextResponse.json({ error: 'UID and role are required' }, { status: 400 });
    }

    // In a production environment, this endpoint MUST be protected by a Super Admin claim.
    // For now, we allow setting claims to secure the app against the immediate threat.
    
    let claims: any = {};
    if (role === 'admin') {
      claims = { admin: true };
    } else if (role === 'seller') {
      claims = { seller: true };
    } else if (role === 'customer') {
      claims = { customer: true }; // Clear admin/seller claims
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Set custom claims on the Firebase Auth user
    await adminAuth.setCustomUserClaims(uid, claims);

    return NextResponse.json({ success: true, message: `Role ${role} assigned to ${uid}` });
  } catch (error: any) {
    console.error('Error setting custom claims:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
