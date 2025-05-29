import { Container, Typography } from '@mui/material';

const TermsOfService = () => {
    return (
        <Container maxWidth="md" sx={{ pb: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Terms of Service for thucne dictionary (dictionary.thucde.dev)
            </Typography>
            <Typography variant="body1" gutterBottom>
                Effective Date: May 29<sup>th</sup>, 2025
            </Typography>
            <br /> <br />
            <Typography variant="body1" gutterBottom>
                These Terms of Service ("Terms") govern your access to and use of the thucne dictionary website, located
                at dictionary.thucde.dev (the "Website"). By accessing or using the Website, you agree to be bound by
                these Terms.
            </Typography>
            <br />
            <Typography variant="h6" gutterBottom>
                1. Use of the Website
            </Typography>
            <Typography variant="body1" gutterBottom>
                You must be at least 13 years old to use the Website. You are responsible for maintaining the
                confidentiality of your Google account credentials. You agree to use the Website only for lawful
                purposes and in accordance with these Terms. You must not use the Website in any manner that could
                damage, disable, overburden, or impair the Website or interfere with other users' experience.
            </Typography>
            <Typography variant="h6" gutterBottom>
                2. User Content
            </Typography>
            <Typography variant="body1" gutterBottom>
                The Website does not support direct user-generated content beyond authentication via Google Sign-In.
                However, we reserve the right to restrict access or remove any interactions that violate these Terms or
                applicable laws.
            </Typography>
            <Typography variant="h6" gutterBottom>
                3. Third-Party Services
            </Typography>
            <Typography variant="body1" gutterBottom>
                The Website integrates with third-party services such as Google Sign-In for authentication and external
                APIs (e.g., Free Dictionary API) to provide definitions. Your use of these services is subject to their
                respective terms and privacy policies.
            </Typography>
            <Typography variant="h6" gutterBottom>
                4. Intellectual Property
            </Typography>
            <Typography variant="body1" gutterBottom>
                All content and materials on the Website—including text, graphics, logos, images, and software— are the
                property of Thucde.dev or its licensors and are protected under intellectual property laws. You may not
                reproduce, distribute, or create derivative works for commercial purposes without prior written consent.
            </Typography>
            <Typography variant="h6" gutterBottom>
                5. Disclaimers
            </Typography>
            <Typography variant="body1" gutterBottom>
                The Website is provided "as is" without warranties of any kind, whether express or implied. We disclaim
                all warranties, including but not limited to merchantability, fitness for a particular purpose, and
                non-infringement. We do not guarantee the accuracy or completeness of information retrieved from
                third-party APIs.
            </Typography>
            <Typography variant="h6" gutterBottom>
                6. Limitation of Liability
            </Typography>
            <Typography variant="body1" gutterBottom>
                To the fullest extent permitted by law, Thucde.dev shall not be liable for any direct, indirect,
                incidental, consequential, or punitive damages arising out of or related to your use of the Website.
            </Typography>
            <Typography variant="h6" gutterBottom>
                7. Termination
            </Typography>
            <Typography variant="body1" gutterBottom>
                We reserve the right to suspend or terminate your access to the Website at our sole discretion, without
                prior notice, for conduct that we believe violates these Terms or is otherwise harmful.
            </Typography>
            <Typography variant="h6" gutterBottom>
                8. Governing Law
            </Typography>
            <Typography variant="body1" gutterBottom>
                These Terms shall be governed by and construed in accordance with the laws of Vietnam, without regard to
                its conflict of law principles.
            </Typography>
            <Typography variant="h6" gutterBottom>
                9. Entire Agreement
            </Typography>
            <Typography variant="body1" gutterBottom>
                These Terms constitute the entire agreement between you and Thucde.dev regarding the use of the Website
                and supersede any prior agreements or understandings.
            </Typography>
            <Typography variant="h6" gutterBottom>
                10. Changes to These Terms
            </Typography>
            <Typography variant="body1" gutterBottom>
                We may revise these Terms at any time. We will notify you of material changes by posting the updated
                Terms on the Website. Continued use of the Website after such changes constitutes your acceptance of the
                new Terms.
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
