import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

// refer to the bootstrap modal component
function Success(props) {
    // success modals inform the user that the operation is done and it will jump to another link
    const { body, link, button, other } = props

    return (
        <Modal show={true}>
            <Modal.Header>
                <Modal.Title>Success!</Modal.Title>
            </Modal.Header>

            <Modal.Body>
    <p>You have successfully {body}!</p>
                {other && <div>
                    <small className="text-muted"> this page will be refreshed in 8s.</small><br />
                    <small className="text-muted"> If no response, please click the button.</small>
                    </div>}
            </Modal.Body>

            <Modal.Footer>
                <a href={link}>
    <Button variant="primary">{button}</Button>
                </a>
            

            </Modal.Footer>
        </Modal>
    )
}

function Warning(props) {
    // Modals for alerting the user to complete the profile
    return (
        <Modal show={props.show}>
            <Modal.Header>
                <Modal.Title>Warning</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please check your real-name authentication and complete your profile!</p>
            </Modal.Body>

            <Modal.Footer>
                <a href="/profile">
                    <Button variant="primary">Check Profile</Button>
                </a>

            </Modal.Footer>
        </Modal>
    )
    
}

function WarningLogin(props) {
    // Warning modals which inform the user to login
    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                You have not signed in! Please sign in and join as {props.role}!
        </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
          </Button>
                <a href="/signin">
                    <Button variant="primary">Sign In</Button>
                </a>
                <a href="/register">
                    <Button variant="primary">Sign Up</Button>
                </a>

            </Modal.Footer>
        </Modal>
    )
}

function ConfirmCancel(props) {
    // used in cancel observe to confirm the user's operation
    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Confirm Your Process</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Do you want to cancel this observation? this operation cannot be retrieved!
        </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
          </Button>
                <Button variant="primary" onClick={props.cancelObserve}>Confirm</Button>


            </Modal.Footer>
        </Modal>
    )
    
}

const PolicyAlert = () => {
    // used to alert users to read the policy before registration

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <label onClick={handleShow}>
                <p className="text-danger font-weight-bold font-italic" style={{ cursor: "pointer" }}>Privacy Policy</p>
            </label>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Privacy Policy</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    General
            <br />
            1. This Privacy Policy applies to how and when information
            (including personal information) is collected, used, stored or
            otherwise handled by Giritharan Group Pty Ltd or its affiliates
            (collectively referred to herein as "Giritharan Group", "Anywhere
            Auctions", "we", "our" or "us"), including personal information
            collected, without limitation: (a) through our website:
            www.anywhereauctions.com.au and/or sub-platforms of this website;
            (b) through any third party authorised by us, such as licenced real
            estate agents, to verify your identity and/or to approve your use of
            our services; (c) through any other registration process required
            for the purpose of using our services; and (d) any postal, e-mail,
            virtual messenger, text message, telephone or any other like
            communications with us.
            <br />
            2. Any reference to this website includes any sub-platform of this
            website and any reference to a sub-platform of this website includes
            this website.
            <br />
            3. This Privacy Policy sets out the manner in which we may collect,
            use and disclose your information and applies to all users of our
            services, including any user who contacts, registers or otherwise
            submits information to us or our affiliates.
            <br />
            4. We may collect, use, store or otherwise handle your personal
            information for purposes directly related or reasonably necessary to
            the provision and conduct of our services.
            <br />
            5. The Giritharan Group respect your privacy and is committed to
            protecting the privacy of any personal information provided to us in
            accordance with the Australian Privacy Principles and the Privacy
            Act 1988 (Cth).
            <br />
            Your Acknowledgment
            <br />
            6. This Privacy Policy forms part of our Terms and Conditions. By
            using our website and/or our services, you acknowledge and agree to
            be bound by the terms, conditions and/or notices provided in this
            Privacy Policy.
            <br />
            7. To the fullest extent permitted by law, you acknowledge and agree
            that the Giritharan Group reserves the right to modify or vary any
            terms, conditions and/or notices in relation to this Privacy Policy
            and our website, at our sole and absolute discretion, without notice
            and without liability to you or any third party, including without
            limitation, to reflect any changes in the law, technology or our
            operations and services. Collection of Personal Information
            <br />
            8. Personal information is any information from which your identity
            may be ascertained or discerned.
            <br />
            9. The nature of personal information (including sensitive personal
            information) collected, used, stored or otherwise handled by us may
            include, but is not limited to, your name, contact details
            (including address, phone, fax and e-mail), your occupation, your
            date of birth, your nationality and migration status, information to
            assist in the verification of your identity (including authorised
            current and valid driver's licence, passport or other forms of
            photographic identification), your credit information (including
            your associated financial institutions), credit card numbers,
            internet protocol ("IP") address and any other necessary information
            which may be required from time to time in order for us to fulfil
            the functions and delivery of our services.
            <br />
            10. We only collect personal information (including sensitive
            personal information) for purposes directly related to, or
            reasonably necessary for, our functions, activities and/or services,
            including but not limited to:
            <br />
            (a) establishing and maintaining contact with you and/or your agent
            and/or any other stakeholder;
            <br />
            (b) verifying your identity, including any verification of identity
            checks undertaken by a third party, including a licenced real estate
            agent, legal practitioner or conveyancer;
            <br />
            (c) assessing the suitability and appropriateness of our services
            for your needs;
            <br />
            (d) providing you with access to real estate information;
            <br />
            (e) facilitating your use and access to our online auction platform;
            <br />
            (f) facilitating our internal management and business operations,
            policies or procedures; and
            <br />
            (g) the conduct and operation of this website.
            <br />
            11. Your personal information (including sensitive personal
            information) may be collected directly or indirectly within the
            course of our dealings with you and from a number of different
            sources, including any correspondence and communications you may
            have with us either verbally or in writing, any registration,
            consent or approval forms you may submit to us or by any authorised
            and licenced third party, and any documents you or any authorised
            third party may upload to our system.
            <br />
            12. In order to confirm and verify the identity of any user of our
            services, all verification of identity and approval processes are
            carried out by authorised and licenced third parties who have the
            responsibility or carriage over any real estate listings. Your
            personal information (including sensitive personal information)
            collected by these authorised and licenced third parties is also
            provided to us in order to facilitate your registration, access and
            use of our services.
          </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
            </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { Success, Warning, PolicyAlert, WarningLogin, ConfirmCancel }