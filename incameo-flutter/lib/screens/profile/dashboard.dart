import 'package:firebase_auth/firebase_auth.dart';
import 'package:incameo/imports.dart';
import 'package:incameo/services/authentication.dart';
import 'package:provider/provider.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    //final User? _user = Provider.of<User>(context);
    //print(_user);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: Center(
        child: Consumer<User?>(
          builder: (context, user, child) {
            return Column(
              children: <Widget>[
                OutlinedButton(
                    onPressed: () {
                      AuthenticationService().signOut();
                    },
                    child: const Text('Sign Out')),
                Text(user?.uid ?? 'null')
              ],
            );
          },
        ),
      ),
    );
  }
}
