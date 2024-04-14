import React from 'react';
import { Metadata } from 'next';
import { Container, Typography } from '@mui/material';

export const metadata: Metadata = {
    title: 'Privacy Policy | My Lexicons',
    description:
        'Learn how My Lexicons protects your privacy. We only store your email &amp; favorite words (without definitions) for managing your lexicons.'
};

const PrivacyPolicy = () => {
    return (
        <Container maxWidth="md" sx={{ pb: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Privacy Policy for My Lexicons (lexicon-app.at.thucde.dev)
            </Typography>
            <Typography variant="body1" gutterBottom>
                Effective Date: 2024-04-14
            </Typography>

            <Typography variant="body1" gutterBottom>
                This privacy policy (&quot;Policy&quot;) describes how My Lexicons (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) handles information when
                you use our website, located at lexicon-app.at.thucde.dev (the &quot;Website&quot;).
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom>
                Information We Collect
            </Typography>

            <Typography variant="body1" gutterBottom>
                We collect only your email address when you authenticate through Google Sign-In. This email address is
                used solely to identify you as the creator and manager of your favorite lexicons on the Website. We do
                not store any other personal data associated with your Google account.
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom>
                Use of Information
            </Typography>

            <Typography variant="body1" gutterBottom>
                We use your email address to associate it with your favorite lexicons stored on the Website. This allows
                you to access and manage your lexicons across sessions.
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom>
                Information Not Collected or Stored
            </Typography>

            <Typography variant="body1" gutterBottom>
                We emphasize that My Lexicons does not collect or store any personal data beyond your email address.
                This includes:
            </Typography>

            <ul>
                <li>
                    <Typography variant="body1">Names</Typography>
                </li>
                <li>
                    <Typography variant="body1">Phone numbers</Typography>
                </li>
                <li>
                    <Typography variant="body1">Addresses</Typography>
                </li>
                <li>
                    <Typography variant="body1">IP addresses</Typography>
                </li>
                <li>
                    <Typography variant="body1">Browsing activity</Typography>
                </li>
                <li>
                    <Typography variant="body1">Lexicon content (beyond the data you choose to include)</Typography>
                </li>
            </ul>

            <Typography variant="h6" component="h3" gutterBottom>
                Free Dictionary API
            </Typography>

            <Typography variant="body1" gutterBottom>
                We utilize the Free Dictionary API to provide word definitions within the Website. When you search for a
                word, we interact with the Free Dictionary API, but we do not store any search history or information
                retrieved from this API.
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom>
                Favorite Words
            </Typography>

            <Typography variant="body1" gutterBottom>
                The Website allows you to save favorite words for easy access in the future. These favorite words are
                associated with your email address and stored securely. However, please note that:
            </Typography>

            <ul>
                <li>
                    <Typography variant="body1">
                        Only the words themselves are stored: We do not store any definitions or additional information
                        retrieved from the Free Dictionary API related to your favorite words.
                    </Typography>
                </li>
                <li>
                    <Typography variant="body1">
                        No analysis of favorite words: We do not analyze the content of your favorite words for any
                        purpose.
                    </Typography>
                </li>
            </ul>

            <Typography variant="h6" component="h3" gutterBottom>
                Disclosure of Information
            </Typography>

            <Typography variant="body1" gutterBottom>
                We will not disclose your email address or favorite words to any third party except in the following
                limited cases:
            </Typography>

            <ul>
                <li>
                    <Typography variant="body1">
                        Legal Requirements: We may disclose your information if we are required to do so by law or in
                        response to a valid subpoena, court order, or other legal process.
                    </Typography>
                </li>
            </ul>

            <Typography variant="h6" component="h3" gutterBottom>
                Security
            </Typography>

            <Typography variant="body1" gutterBottom>
                We maintain industry-standard security measures to protect your email address and favorite words from
                unauthorized access. However, as with any online service, we cannot guarantee absolute security.
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom>
                Your Choices
            </Typography>

            <Typography variant="body1" gutterBottom>
                You can revoke our access to your Google email address at any time by changing your Google account
                settings. This will prevent you from accessing your favorite lexicons on the Website. You can also
                remove your favorite words from within the Website.
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom>
                Changes to this Policy
            </Typography>

            <Typography variant="body1" gutterBottom>
                We may update this Policy from time to time. We will notify you of any changes by posting the new Policy
                on the Website. You are advised to review this Policy periodically for any changes.
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom>
                Contact Us
            </Typography>

            <Typography variant="body1" gutterBottom>
                If you have any questions about this Policy, please contact us at: contact@thucde.dev
            </Typography>
        </Container>
    );
};

export default PrivacyPolicy;
