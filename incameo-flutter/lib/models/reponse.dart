class Response {
  bool success;
  String message;
  String? errorCode;

  Response({required this.success, required this.message, this.errorCode});
}
