import { ImageResponse } from 'next/og';
import { DYNAMIC_OG_BG } from '@/constants';

export const runtime = 'edge';

export const size = {
    width: 2400,
    height: 1260
};
export const contentType = 'image/jpg';

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

type Params = {
    word: string;
};

export default async function OpengraphImage(context: { params: Params }) {
    const word = context?.params?.word;
    const data = await getInter();

    return Promise.resolve(
        new ImageResponse(
            (
                <div
                    style={{
                        backgroundImage: `url("${DYNAMIC_OG_BG}")`,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <p
                        style={{
                            fontSize: calculateFontSize(word),
                            color: '#f4ca44',
                            fontWeight: 700,
                            textDecoration: 'underline',
                            backgroundColor: '#59b379',
                            padding: '0 40px',
                            maxWidth: '90%'
                        }}
                    >
                        {word}
                    </p>
                </div>
            ),
            {
                ...size,
                fonts: [
                    {
                        name: 'Inter',
                        data,
                        weight: 700
                    }
                ]
            }
        )
    );
}
