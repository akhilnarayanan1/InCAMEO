import 'package:firebase_auth/firebase_auth.dart';

class RegisteredUser {
  User? user;
  RegisteredUser({this.user});

  String? getUID() {
    return user?.uid;
  }

  String? getEmail() {
    return user?.email;
  }

  String? getDisplayName() {
    return user?.displayName;
  }

  bool? isEmailVerified() {
    return user?.emailVerified;
  }
}
