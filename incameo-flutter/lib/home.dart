import 'package:incameo/imports.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            OutlinedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/login/');
                },
                child: const Text('Login')),
            OutlinedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/signup/');
                },
                child: const Text('Sign Up')),
            OutlinedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/dashboard/');
                },
                child: const Text('Dashboard')),
          ],
        ),
      ),
    );
  }
}
