import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const { uid, role } = await req.json();

    if (!uid || !role) {
      return NextResponse.json({ error: 'UID and role are required' }, { status: 400 });
    }

    // SECURE THE ENDPOINT: Require Super Admin auth
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Only super_admin or admin can set roles
    if (!decodedToken.super_admin && !decodedToken.admin) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

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
