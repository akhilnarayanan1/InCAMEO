import 'package:incameo/imports.dart';
import 'package:incameo/models/reponse.dart';
import 'package:incameo/services/authentication.dart';
import 'package:incameo/services/form.dart';
import 'package:provider/provider.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({Key? key}) : super(key: key);

  @override
  _ForgotPasswordPageState createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
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
                    children: const <Widget>[
                      Text(
                        'Forgot Password',
                        textAlign: TextAlign.left,
                        style: TextStyle(
                          overflow: TextOverflow.clip,
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 24),
                      Text(
                          'Enter the email address associated with your account.'),
                      SizedBox(height: 24),
                      ForgotPasswordForm(),
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

FORGOT PASSWORD FORM

*/

class ForgotPasswordForm extends StatefulWidget {
  const ForgotPasswordForm({Key? key}) : super(key: key);

  @override
  State<ForgotPasswordForm> createState() => _ForgotPasswordFormState();
}

class _ForgotPasswordFormState extends State<ForgotPasswordForm> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final AuthenticationService _auth = AuthenticationService();

  TextEditingController emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          CustomTextFormField(
            fieldId: 'forgot_email',
            labelText: 'Email',
            hintText: 'Enter your email',
            controller: emailController,
            type: 'email',
          ),
          const SizedBox(height: 16),
          CustomSubmitButton(
            text: 'FORGOT PASSWORD',
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                Provider.of<SubmitButton>(context, listen: false)
                    .startLoading();

                Response response =
                    await _auth.forgotPassword(userEmail: emailController.text);

                if ((response.errorCode != 'user-not-found' &&
                    response.errorCode != 'invalid-email')) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(response.message)),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content:
                          Text("Reset link succesfully sent to your e-mail 📧"),
                    ),
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
