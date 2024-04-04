'use client';

import React from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { Container, Typography, Stack, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Grid from '@/components/atoms/AppGrid';
import { GitHubIcon } from '@/components/atoms/AppIcons';
import { THUCDEDEV_BANNER_PNG, THUCDEDEV_BANNER_PNG_DARK } from '@/constants';

const Footer = () => {
    const theme = useTheme();
    return [
        <Divider key="footer-div" />,
        <Container key="footer-main" component="footer" maxWidth={false} sx={{ p: 2 }}>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid container direction="column">
                    <Grid>
                        <Stack>
                            <Link href="https://thucde.dev/" className="h-[50px]">
                                <Image
                                    src={
                                        theme.palette.mode === 'light'
                                            ? THUCDEDEV_BANNER_PNG
                                            : THUCDEDEV_BANNER_PNG_DARK
                                    }
                                    alt="Thucde.dev Logo"
                                    width={200}
                                    height={50}
                                    draggable={false}
                                    quality={100}
                                    style={{
                                        objectFit: 'contain'
                                    }}
                                    loading="lazy"
                                />
                            </Link>
                        </Stack>
                    </Grid>
                    <Grid>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Copyright © {new Date().getFullYear()} Thucde.dev. All rights reserved.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2" color="textSecondary">
                            Source Code available!
                        </Typography>
                        <Link href="https://github.com/thucne/thucs-lexicons" target="_blank">
                            <GitHubIcon />
                        </Link>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    ];
};

export default Footer;
