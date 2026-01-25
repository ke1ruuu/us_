import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
    try {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0a0a0a',
                    }}
                >
                    {/* Background Glows using radial gradients (Satori compatible) */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(250, 204, 21, 0.1) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(250, 204, 21, 0.05) 0%, transparent 60%)',
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '60px 80px',
                            border: '2px solid rgba(250, 204, 21, 0.2)',
                            borderRadius: '50px',
                            backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '120px',
                                height: '120px',
                                borderRadius: '30px',
                                background: 'linear-gradient(to bottom right, #facc15, #eab308)',
                                marginBottom: '30px',
                                boxShadow: '0 10px 30px rgba(250, 204, 21, 0.3)',
                            }}
                        >
                            <svg
                                width="70"
                                height="70"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#000"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '96px', fontWeight: '900', color: '#facc15', fontStyle: 'italic', marginRight: '20px' }}>US</span>
                            <span style={{ fontSize: '96px', fontWeight: '900', color: 'white' }}>SPACE</span>
                        </div>

                        <p
                            style={{
                                fontSize: '28px',
                                fontWeight: '500',
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginTop: '10px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                            }}
                        >
                            A private corner for us
                        </p>
                    </div>

                    {/* Subtle corner elements */}
                    <div style={{ position: 'absolute', top: 40, right: 40, color: 'rgba(250, 204, 21, 0.2)', fontSize: '20px', fontWeight: 'bold' }}>EST. 2026</div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
