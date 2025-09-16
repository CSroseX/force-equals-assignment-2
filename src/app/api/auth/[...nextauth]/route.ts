// src/app/api/sellers/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Your GET logic here
    return NextResponse.json({ message: 'GET request successful' });
  } catch (error) {
    // Either use the error variable
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Your POST logic here
    const body = await request.json();
    return NextResponse.json({ message: 'POST request successful', data: body });
  } catch (error) {
    // Either use the error variable
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Alternative approach - if you don't want to use the error variable:
// export async function GET() {
//   try {
//     // Your GET logic here
//     return NextResponse.json({ message: 'GET request successful' });
//   } catch {
//     // No variable name - ESLint won't complain
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }