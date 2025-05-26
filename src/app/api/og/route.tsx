import { ImageResponse } from 'next/og';
import { DYNAMIC_OG_BG } from '@/constants';

export const runtime = 'edge';

const calculateFontSize = (text = '') => {
    const count = text.length;

    if (count < 20) {
        return 200;
    }

    if (count < 40) {
        return 160;
    }

    if (count < 80) {
        return 130;
    }

    return 100;
};

const getInter = async () => {
    const response = await fetch(new URL('fonts/Inter/static/Inter-SemiBold.ttf', import.meta.url));
    const buffer = await response.arrayBuffer();

    return buffer;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const word = searchParams.get('word') ?? 'Hello, World!';
    const definition = searchParams.get('definition');

    return new ImageResponse(
        (
            <div
                style={{
                    backgroundImage: `url("${DYNAMIC_OG_BG}")`,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    padding: '125px',
                }}
            >
                <p
                    style={{
                        fontSize: calculateFontSize(word),
                        color: 'black',
                        fontWeight: 700,
                        backgroundColor: '#ffca28',
                        padding: '0 40px',
                        maxWidth: '90%',
                    }}
                >
                    {word}
                </p>
                {definition?.length ? (
                    <p
                        style={{
                            fontSize: 70,
                            color: 'white',
                            fontWeight: 700,
                            padding: '0 40px',
                            maxWidth: '90%',
                            marginTop: '50px',
                            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9)',
                            borderLeft: "10px solid yellow"
                        }}
                    >
                        {definition}
                    </p>
                ) : null}
            </div>
        ),
        {
            fonts: [
                {
                    name: 'Inter',
                    data: await getInter(),
                    weight: 700
                }
            ],
            width: 2400,
            height: 1260
        }
    );
}
