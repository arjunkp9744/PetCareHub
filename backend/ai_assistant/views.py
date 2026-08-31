from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .ai_service import ask_ai


class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get("question")

        if not question:
            return Response(
                {
                    "error": "Question is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            answer = ask_ai(question)

            return Response(
                {
                    "question": question,
                    "answer": answer,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:
            print("AI Error:", error)

            return Response(
                {
                    "error": "Unable to get a response from the AI assistant."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )