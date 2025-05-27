import { ImageResponse } from 'next/og';
import { DYNAMIC_OG_BG } from '@/constants';
import _ from 'lodash';

export const runtime = 'edge';

const calculateFontSize = (text = '') => {
    const count = text.length;

    if (count < 20) {
        return 100;
    }

    if (count < 40) {
        return 80;
    }

    if (count < 80) {
        return 65;
    }

    return 50;
};

const getInter = async () => {
    const response = await fetch(new URL('fonts/Inter/static/Inter-SemiBold.ttf', import.meta.url));
    const buffer = await response.arrayBuffer();

    return buffer;
};

const smartTrim = (str = '', n: number, delim = ' ', appendix = '...') => {
    const trueLength = _.max([0, n - appendix.length]) || 0;

    if (str.length <= trueLength) return str;
    const trimmedStr = str.slice(0, trueLength + delim.length);
    const lastDelimIndex = trimmedStr.lastIndexOf(delim);
    if (lastDelimIndex >= 0) return trimmedStr.slice(0, lastDelimIndex) + appendix;
    return trimmedStr + appendix;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const word = searchParams.get('word') ?? 'Hello, World!';
    const definition = searchParams.get('definition') || '';
    const trimmedDefinition = smartTrim(definition, 150, ' ', '... Learn more.');

    return new ImageResponse(
        (
            <div
                style={{
                    backgroundImage: `url("${DYNAMIC_OG_BG}") `,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center', // Keeps it centered
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    padding: '62.5px',
                }}
            >
                <p
                    style={{
                        fontSize: calculateFontSize(word),
                        color: 'black',
                        fontWeight: 700,
                        backgroundColor: '#ffca28',
                        padding: '0 20px',
                        maxWidth: '90%'
                    }}
                >
                    {word}
                </p>
                {definition?.length ? (
                    <p
                        style={{
                            fontSize: 35,
                            color: 'white',
                            fontWeight: 700,
                            padding: '0 20px',
                            maxWidth: '90%',
                            marginTop: '25px',
                            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9)',
                            borderLeft: '5px solid yellow'
                        }}
                    >
                        {trimmedDefinition}
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
            width: 1200,
            height: 630
        }
    );
}
