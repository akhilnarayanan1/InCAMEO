import 'package:firebase_auth/firebase_auth.dart';
import 'package:incameo/imports.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:incameo/services/authentication.dart';
import 'package:incameo/services/form.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  configureApp();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ErrorText()),
        ChangeNotifierProvider(create: (_) => SubmitButton()),
        StreamProvider<User?>.value(
            value: AuthenticationService().authStateChanges, initialData: null)
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'InCAMEO',
      initialRoute: '/',
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      routes: {
        '/': (context) => const HomePage(),
        '/login/': (context) => const LoginPage(),
        '/signup/': (context) => const SignupPage(),
        '/forgot/': (context) => const ForgotPasswordPage(),
        '/terms/': (context) => const ForgotPasswordPage(),
        '/privacypolicy/': (context) => const ForgotPasswordPage(),
        '/dashboard/': (context) => const DashboardPage(),
      },
    );
  }
}
