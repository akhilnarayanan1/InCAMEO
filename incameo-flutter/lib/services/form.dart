import 'package:flutter/material.dart';

class ErrorText extends ChangeNotifier {
  String? _errorText;
  String? _fieldId;

  String? getError() {
    return _errorText;
  }

  String? getFieldId() {
    return _fieldId;
  }

  void updateError(String? errorMessage, String? fieldId) {
    _errorText = errorMessage;
    _fieldId = fieldId;
    notifyListeners();
  }

  void removeError(String? fieldId, String? errorFieldId) {
    if ((fieldId == errorFieldId) || (errorFieldId == null)) {
      _errorText = null;
      _fieldId = null;
      notifyListeners();
    }
  }
}

class SubmitButton extends ChangeNotifier {
  bool _isLoading = false;

  void startLoading() {
    _isLoading = true;
    notifyListeners();
  }

  void stopLoading() {
    _isLoading = false;
    notifyListeners();
  }

  bool isLoading() {
    return _isLoading;
  }
}
