import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:incameo/services/form.dart';
import 'package:provider/provider.dart';

class CustomTextFormField extends StatefulWidget {
  final String? fieldId;
  final String labelText;
  final String hintText;
  final String? type;
  final String? errorText;
  final TextEditingController controller;

  const CustomTextFormField(
      {Key? key,
      this.fieldId,
      required this.labelText,
      required this.hintText,
      this.type,
      this.errorText,
      required this.controller})
      : super(key: key);

  @override
  State<CustomTextFormField> createState() => _CustomTextFormFieldState();
}

class _CustomTextFormFieldState extends State<CustomTextFormField> {
  @override
  Widget build(BuildContext context) {
    final passwordValidator = MultiValidator([
      // RequiredValidator(errorText: 'Password is required'),
      // MinLengthValidator(6,
      //     errorText: 'Password must be at least 6 digits long'),
      // PatternValidator(r'(?=.*?[#?!@$%^&*-])',
      //     errorText: 'passwords must have at least one special character')
    ]);

    final emailValidator = MultiValidator([
      // EmailValidator(errorText: 'Enter a valid email address'),
      // RequiredValidator(errorText: 'Email is required'),
    ]);

    final String? errorFieldId = Provider.of<ErrorText>(context).getFieldId();

    final fieldValidator = (widget.type == 'password')
        ? passwordValidator
        : (widget.type == 'email')
            ? emailValidator
            : MultiValidator([]);

    return Padding(
      padding: const EdgeInsets.fromLTRB(0.0, 8.0, 0.0, 8.0),
      child: TextFormField(
        //onFieldSubmitted: (value) {},
        onEditingComplete: () {
          if (widget.fieldId == errorFieldId) {
            Provider.of<ErrorText>(context, listen: false)
                .removeError(widget.fieldId, errorFieldId);
          }
        },
        controller: widget.controller,
        obscureText: (widget.type == 'password') ? true : false,
        enableSuggestions: (widget.type == 'password') ? false : true,
        autocorrect: (widget.type == 'password') ? false : true,
        decoration: InputDecoration(
          errorText: (widget.fieldId == errorFieldId)
              ? Provider.of<ErrorText>(context).getError()
              : null,
          labelText: widget.labelText,
          hintText: widget.hintText,
          border: const OutlineInputBorder(),
        ),
        validator: fieldValidator,
      ),
    );
  }
}

class CustomSubmitButton extends StatefulWidget {
  final String text;
  final VoidCallback onPressed;

  const CustomSubmitButton(
      {Key? key, required this.text, required this.onPressed})
      : super(key: key);

  @override
  _CustomSubmitButtonState createState() => _CustomSubmitButtonState();
}

class _CustomSubmitButtonState extends State<CustomSubmitButton> {
  @override
  Widget build(BuildContext context) {
    bool isLoading = Provider.of<SubmitButton>(context).isLoading();

    return TextButton(
      onPressed: widget.onPressed,
      style: TextButton.styleFrom(
        minimumSize: const Size.fromHeight(50.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(50.0),
        ),
        textStyle: const TextStyle(
          overflow: TextOverflow.ellipsis,
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
        backgroundColor: Colors.deepPurple,
        primary: Colors.white,
      ),
      child: SizedBox(
        height: isLoading ? 20.0 : null,
        width: isLoading ? 20.0 : null,
        child: isLoading ? textOrLoading() : Text(widget.text),
      ),
    );
  }
}

Widget textOrLoading() {
  return const CircularProgressIndicator(
    strokeWidth: 3.0,
    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
  );
}
