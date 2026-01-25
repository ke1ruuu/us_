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
                        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(250, 204, 21, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(250, 204, 21, 0.03) 0%, transparent 50%)',
                    }}
                >
                    {/* Decorative background elements */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '10%',
                            left: '10%',
                            width: '400px',
                            height: '400px',
                            borderRadius: '100%',
                            background: 'rgba(250, 204, 21, 0.05)',
                            filter: 'blur(100px)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            right: '10%',
                            width: '300px',
                            height: '300px',
                            borderRadius: '100%',
                            background: 'rgba(250, 204, 21, 0.03)',
                            filter: 'blur(80px)',
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px',
                            border: '1px solid rgba(250, 204, 21, 0.2)',
                            borderRadius: '40px',
                            backgroundColor: 'rgba(250, 204, 21, 0.05)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100px',
                                height: '100px',
                                borderRadius: '25px',
                                background: 'linear-gradient(to bottom right, #facc15, #eab308)',
                                marginBottom: '20px',
                            }}
                        >
                            <svg
                                width="60"
                                height="60"
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

                        <h1
                            style={{
                                fontSize: '84px',
                                fontWeight: '900',
                                color: 'white',
                                margin: '0',
                                display: 'flex',
                            }}
                        >
                            <span style={{ color: '#facc15', fontStyle: 'italic', marginRight: '16px' }}>US</span>
                            SPACE
                        </h1>
                        <p
                            style={{
                                fontSize: '24px',
                                fontWeight: '500',
                                color: 'rgba(255, 255, 255, 0.6)',
                                marginTop: '12px',
                                letterSpacing: '0.1em',
                            }}
                        >
                            A PRIVATE CORNER FOR US.
                        </p>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
