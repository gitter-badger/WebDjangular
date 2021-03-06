from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from rest_framework import filters
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.viewsets import GenericViewSet

from webdjangular.apps.users.models import User
from webdjangular.apps.users.permissions.UpdateOwnUser import UpdateOwnUser
from webdjangular.apps.users.serializers.ForgetPasswordSerializer import ForgetPasswordSerializer
from webdjangular.apps.users.serializers.SetPasswordSerializer import SetPasswordSerializer
from webdjangular.apps.users.serializers.UserSerializer import UserSerializer


class UserViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet, DestroyModelMixin):
    """
    Handles:
    Creating an User - Sign Up
    Retrieve a list of users
    Retrieve a specific User
    Update an User
    """
    resource_name = 'user';
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = (JSONWebTokenAuthentication,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('=first_name', 'last_name', 'email', 'username')
    

    @action(methods=['post'], detail=False, url_path='forget-password')
    def forget_password(self, request):
        """
        The user sends an email, if exists in our database and it is verified. Web Djangular sends a link to be redirect to a page to set a new password.
        :param request:
        :return: HTTP 201 Created
        """
        
        serializer = ForgetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(status=HTTP_201_CREATED)
    
    @action(methods=['post'], detail=False, url_path='set-password')
    def set_password(self, request):
        """
        Receive the ForgetPassword uuid and the new password.
        There is no 'confirm password' on the server-side. Only on client-side
        :param request:
        :return:
        """
        
        # check if the Forget Password is valid
        serializer = SetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        
        forget_password = serializer.validated_data['forget_password']
        user = forget_password.user
        
        # check if the new password match with all requirements
        serializer = UserSerializer(user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        
        forget_password.delete()
        serializer.save()
        return Response(status=HTTP_204_NO_CONTENT)

