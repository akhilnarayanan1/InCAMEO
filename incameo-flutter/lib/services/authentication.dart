import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:incameo/models/reponse.dart';

class AuthenticationService {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();

  // Stream<RegisteredUser> get user => _firebaseAuth
  //     .authStateChanges()
  //     .map((User? user) => RegisteredUser(user: user));

  Future<Response> signUpWithEmail(
      {required String userEmail, required String userPassword}) async {
    try {
      UserCredential _userCredential =
          await _firebaseAuth.createUserWithEmailAndPassword(
              email: userEmail, password: userPassword);
      if (_userCredential.user != null) {
        return Response(success: true, message: 'Account created successfully');
      } else {
        return Response(success: false, message: 'Unknown Error');
      }
    } on FirebaseAuthException catch (e) {
      return Response(
        success: false,
        message: e.message.toString(),
        errorCode: e.code,
      );
    }
  }

  Future<Response> loginWithEmail(
      {required String userEmail, required String userPassword}) async {
    try {
      UserCredential _userCredential = await _firebaseAuth
          .signInWithEmailAndPassword(email: userEmail, password: userPassword);
      if (_userCredential.user != null) {
        return Response(success: true, message: 'Logged-In successfully');
      } else {
        return Response(success: false, message: 'Unknown Error');
      }
    } on FirebaseAuthException catch (e) {
      return Response(
        success: false,
        message: e.message.toString(),
        errorCode: e.code,
      );
    }
  }

  Future<Response> forgotPassword({required String userEmail}) async {
    try {
      await _firebaseAuth.sendPasswordResetEmail(email: userEmail);
      return Response(
          success: true, message: 'Reset link succesfully sent to your e-mail');
    } on FirebaseAuthException catch (e) {
      return Response(
        success: false,
        message: e.message.toString(),
        errorCode: e.code,
      );
    }
  }

  Future<void> signOut() async {
    await _firebaseAuth.signOut();
  }
}
