import { Container, Typography } from '@mui/material';

const TermsOfService = () => {
    return (
        <Container maxWidth="md" sx={{ pb: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Privacy Policy for thucne dictionary (dictionary.thucde.dev)
            </Typography>
            <Typography variant="body1" gutterBottom>
                Effective Date: 2024-04-14
            </Typography>
            <Typography variant="body1" gutterBottom>
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of the thucne dictionary
                website, located at dictionary.thucde.dev (the &quot;Website&quot;). By accessing or using the Website,
                you agree to be bound by these Terms.
            </Typography>
            <Typography variant="h6" gutterBottom>
                1. Use of the Website
            </Typography>
            <Typography variant="body1" gutterBottom>
                You must be at least 13 years old to use the Website. You are responsible for maintaining the
                confidentiality of your Google account information. You agree to use the Website for lawful purposes
                only and in accordance with these Terms. You agree not to use the Website in any way that could damage,
                disable, overburden, or impair the Website or interfere with any other user&apos;s enjoyment of the
                Website.
            </Typography>
            <Typography variant="h6" gutterBottom>
                2. User Content
            </Typography>
            <Typography variant="body1" gutterBottom>
                Since the Website does not allow direct user input beyond Google Sign-In, there is no user-generated
                content to moderate. However, we reserve the right to remove any content that we determine to be in
                violation of these Terms or otherwise objectionable.
            </Typography>
            <Typography variant="h6" gutterBottom>
                3. Third-Party Services
            </Typography>
            <Typography variant="body1" gutterBottom>
                The Website integrates with Google Sign-In for user authentication and the Free Dictionary API for word
                definitions. Your use of Google Sign-In is governed by Google&apos;s terms of service and privacy
                policy.
            </Typography>
            <Typography variant="h6" gutterBottom>
                4. Intellectual Property
            </Typography>
            <Typography variant="body1" gutterBottom>
                The Website and all content and materials on the Website (including but not limited to text, graphics,
                logos, images, and software) are the property of Thucde.dev or its licensors and are protected by
                copyright, trademark, and other intellectual property laws. You may not use any content or materials on
                the Website for any commercial purpose without the express written consent of Thucde.dev.
            </Typography>
            <Typography variant="h6" gutterBottom>
                5. Disclaimers
            </Typography>
            <Typography variant="body1" gutterBottom>
                The Website is provided &quot;as is&quot; and without warranties of any kind, whether express or
                implied. We disclaim all warranties, including but not limited to warranties of merchantability, fitness
                for a particular purpose, and non-infringement. We do not warrant that the Website will be uninterrupted
                or error-free. We are not responsible for the accuracy of definitions retrieved from the Free Dictionary
                API.
            </Typography>
            <Typography variant="h6" gutterBottom>
                6. Limitation of Liability
            </Typography>
            <Typography variant="body1" gutterBottom>
                We will not be liable for any damages arising out of or related to your use of the Website, including
                but not limited to direct, indirect, incidental, consequential, or punitive damages.
            </Typography>
            <Typography variant="h6" gutterBottom>
                7. Termination
            </Typography>
            <Typography variant="body1" gutterBottom>
                We may terminate your access to the Website for any reason, at any time, without notice.
            </Typography>
            <Typography variant="h6" gutterBottom>
                8. Governing Law
            </Typography>
            <Typography variant="body1" gutterBottom>
                These Terms will be governed by and construed in accordance with the laws of Vietnam.
            </Typography>
            <Typography variant="h6" gutterBottom>
                9. Entire Agreement
            </Typography>
            <Typography variant="body1" gutterBottom>
                These Terms constitute the entire agreement between you and us regarding your use of the Website.
            </Typography>
            <Typography variant="h6" gutterBottom>
                10. Changes to the Terms
            </Typography>
            <Typography variant="body1" gutterBottom>
                We may update these Terms from time to time. We will notify you of any changes by posting the new Terms
                on the Website. You are advised to review these Terms periodically for any changes.
            </Typography>
            <Typography variant="h6" gutterBottom>
                11. Contact Us
            </Typography>
            <Typography variant="body1" gutterBottom>
                If you have any questions about these Terms, please contact us at: contact@thucde.dev
            </Typography>
        </Container>
    );
};

export default TermsOfService;
