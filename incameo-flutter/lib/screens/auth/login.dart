import 'package:incameo/imports.dart';
import 'package:flutter/gestures.dart';
import 'package:incameo/models/reponse.dart';
import 'package:incameo/services/authentication.dart';
import 'package:incameo/services/form.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
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
                        'Login',
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
                            const TextSpan(text: "Don't have an account? "),
                            TextSpan(
                                text: "Create your account",
                                style: const TextStyle(
                                  color: Colors.deepPurple,
                                  fontWeight: FontWeight.bold,
                                ),
                                recognizer: TapGestureRecognizer()
                                  ..onTap = () =>
                                      Navigator.pushReplacementNamed(
                                          context, '/signup/')),
                            const TextSpan(
                                text: ', it takes less than a minute.'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      const LoginForm(),
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

LOGIN FORM

*/

class LoginForm extends StatefulWidget {
  const LoginForm({Key? key}) : super(key: key);

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final AuthenticationService _auth = AuthenticationService();

  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          CustomTextFormField(
            fieldId: 'login_email',
            labelText: 'Email',
            hintText: 'Enter your email',
            type: 'email',
            controller: emailController,
          ),
          CustomTextFormField(
            fieldId: 'login_password',
            labelText: 'Password',
            hintText: 'Enter your password',
            type: 'password',
            controller: passwordController,
          ),
          const SizedBox(height: 16),
          Text.rich(
            TextSpan(
              children: <TextSpan>[
                TextSpan(
                  text: "Forgot Password?",
                  style: const TextStyle(
                    color: Colors.deepPurple,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  recognizer: TapGestureRecognizer()
                    ..onTap = () => Navigator.pushNamed(context, '/forgot/'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          CustomSubmitButton(
            text: 'LOGIN',
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                Provider.of<SubmitButton>(context, listen: false)
                    .startLoading();

                Response response = await _auth.loginWithEmail(
                    userEmail: emailController.text,
                    userPassword: passwordController.text);

                if (!response.success &&
                    (response.errorCode == 'user-not-found' ||
                        response.errorCode == 'invalid-email')) {
                  Provider.of<ErrorText>(context, listen: false)
                      .updateError(response.message, 'login_email');
                } else if (!response.success &&
                    response.errorCode == 'wrong-password') {
                  Provider.of<ErrorText>(context, listen: false)
                      .updateError(response.message, 'login_password');
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
