import { Container, Typography } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | thucne dictionary',
    description:
        'Learn how thucne dictionary protects your privacy. We only store your email & favorite words (without definitions) for managing your lexicons.'
};

const PrivacyPolicy = () => {
    return (
        <Container maxWidth="md" sx={{ pb: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Privacy Policy for thucne dictionary (dictionary.thucde.dev)
            </Typography>
            <Typography variant="body1" gutterBottom>
                Effective Date: May 29<sup>th</sup>, 2025
            </Typography>
            <br />
            <br />

            <Typography variant="body1" gutterBottom>
                This privacy policy ("Policy") describes how thucne dictionary ("we," "us," or "our") handles
                information when you use our website, located at dictionary.thucde.dev (the "Website").
            </Typography>
            <br />

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
                We emphasize that thucne dictionary does not collect or store any personal data beyond your email
                address. This includes:
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
                    <Typography variant="body1">
                        Word's/searched term's content/definitions (beyond the data you choose to include)
                    </Typography>
                </li>
            </ul>

            <Typography variant="h6" component="h3" gutterBottom>
                Word Definitions and External APIs
            </Typography>
            <Typography variant="body1" gutterBottom>
                We utilize external APIs to provide word and phrase definitions within the Website:
            </Typography>
            <ul>
                <li>
                    <Typography variant="body1">
                        <strong>Free Dictionary API:</strong> This is our primary source for definitions. When you
                        search for a word, we interact with the Free Dictionary API, but we do not store any search
                        history or information retrieved from this API.
                    </Typography>
                </li>
                <li>
                    <Typography variant="body1">
                        <strong>OpenAI API:</strong> When a word or phrase is not found in the Free Dictionary API, we
                        use the OpenAI API to generate a definition. We do not store or analyze the search terms or the
                        definitions retrieved from OpenAI. Note: Your query is sent to OpenAI’s servers and subject to
                        OpenAI's privacy policy.
                    </Typography>
                </li>
            </ul>

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
                        retrieved from APIs related to your favorite words.
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
                Log Data
            </Typography>
            <Typography variant="body1" gutterBottom>
                We do not log or store IP addresses, device information, timestamps, or other metadata related to your
                activity on the Website.
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom>
                Third-Party Services
            </Typography>
            <Typography variant="body1" gutterBottom>
                We use third-party services to support the functionality of the Website, such as authentication and word
                definition retrieval. These services include Google (for Sign-In) and OpenAI (for definitions). Their
                privacy practices apply when you interact with those services.
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom>
                Data Retention
            </Typography>
            <Typography variant="body1" gutterBottom>
                Your email address and favorite words are retained as long as your account is active. You may delete
                your favorite words at any time. Revoking access to your Google account will also make your associated
                data inaccessible.
            </Typography>

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
                        <strong>Legal Requirements:</strong> We may disclose your information if required to do so by
                        law or in response to a valid subpoena, court order, or legal process.
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
                on the Website. You are advised to review this Policy periodically for any updates.
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
