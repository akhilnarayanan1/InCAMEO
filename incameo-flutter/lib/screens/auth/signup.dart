import 'package:incameo/models/reponse.dart';
import 'package:incameo/services/authentication.dart';
import 'package:incameo/imports.dart';
import 'package:flutter/gestures.dart';
import 'package:incameo/services/form.dart';
import 'package:provider/provider.dart';

class SignupPage extends StatelessWidget {
  const SignupPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final double cardWidth = (MediaQuery.of(context).size.width > 300.0)
        ? 300.0
        : MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        iconTheme: const IconThemeData(
          color: Colors.deepPurple, //change your color here
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Center(
            child: SizedBox(
              width: cardWidth,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      const Text(
                        'Signup',
                        textAlign: TextAlign.left,
                        style: TextStyle(
                          overflow: TextOverflow.clip,
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text.rich(
                        TextSpan(
                          children: <TextSpan>[
                            const TextSpan(text: "Already have an account? "),
                            TextSpan(
                              text: "Login here",
                              style: const TextStyle(
                                color: Colors.deepPurple,
                                fontWeight: FontWeight.bold,
                              ),
                              recognizer: TapGestureRecognizer()
                                ..onTap = () => Navigator.pushReplacementNamed(
                                    context, '/login/'),
                            ),
                            const TextSpan(text: ', and stay ahead!'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      const SignupForm(),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/*

SIGNUP FORM

*/

class SignupForm extends StatefulWidget {
  const SignupForm({Key? key}) : super(key: key);

  @override
  _SignupFormState createState() => _SignupFormState();
}

class _SignupFormState extends State<SignupForm> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final AuthenticationService _auth = AuthenticationService();

  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          CustomTextFormField(
            fieldId: 'signup_email',
            labelText: 'E-mail',
            hintText: 'Enter your e-mail',
            type: 'email',
            controller: emailController,
          ),
          CustomTextFormField(
            fieldId: 'signup_password',
            labelText: 'Password',
            hintText: 'Choose a password',
            type: 'password',
            controller: passwordController,
          ),
          CustomTextFormField(
            fieldId: 'signup_confirmpassword',
            labelText: 'Confirm Password',
            hintText: 'Confirm your password',
            type: 'password',
            controller: confirmPasswordController,
          ),
          const SizedBox(height: 16),
          Text.rich(
            TextSpan(
              children: <TextSpan>[
                const TextSpan(text: "By signing up, you agree to our "),
                TextSpan(
                  text: "Terms of use",
                  style: const TextStyle(
                    color: Colors.deepPurple,
                    fontWeight: FontWeight.bold,
                  ),
                  recognizer: TapGestureRecognizer()
                    ..onTap = () => Navigator.pushNamed(context, '/terms/'),
                ),
                const TextSpan(text: ' & '),
                TextSpan(
                  text: "Privacy Policy",
                  style: const TextStyle(
                    color: Colors.deepPurple,
                    fontWeight: FontWeight.bold,
                  ),
                  recognizer: TapGestureRecognizer()
                    ..onTap =
                        () => Navigator.pushNamed(context, '/privacypolicy/'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          CustomSubmitButton(
            text: 'CREATE ACCOUNT',
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                Provider.of<SubmitButton>(context, listen: false)
                    .startLoading();

                Response response = await _auth.signUpWithEmail(
                    userEmail: emailController.text,
                    userPassword: passwordController.text);

                if (!response.success &&
                    (response.errorCode == 'email-already-in-use' ||
                        response.errorCode == 'invalid-email')) {
                  Provider.of<ErrorText>(context, listen: false)
                      .updateError(response.message, 'signup_email');
                } else if (!response.success &&
                    response.errorCode == 'weak-password') {
                  Provider.of<ErrorText>(context, listen: false)
                      .updateError(response.message, 'signup_password');
                } else if (!response.success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(response.message)),
                  );
                } else {
                  Navigator.pushReplacementNamed(context, '/dashboard/');
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(response.message + " 😄")),
                  );
                }

                Provider.of<SubmitButton>(context, listen: false).stopLoading();
              }
            },
          ),
        ],
      ),
    );
  }
}
