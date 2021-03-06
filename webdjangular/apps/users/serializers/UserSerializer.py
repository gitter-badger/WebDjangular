from django.contrib.auth.models import Group

from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import ValidationError

from rest_framework_json_api.relations import ResourceRelatedField

from django.db import models

from ..models.User import User


class UserSerializer(ModelSerializer):
    """
    The serializer for User Objects
    """
    included_serializers = {
        'groups': 'webdjangular.apps.users.serializers.GroupSerializer.GroupSerializer'
    }

    groups = ResourceRelatedField(
        read_only=True,
        many=True,
        related_link_view_name='group-getuserlist',
        related_link_url_kwarg='user_pk',
        self_link_view_name='user-relationships'
    )

    class Meta:
        model = User
        fields = (
            'id', 'password', 'last_login', 'is_superuser', 'first_name',
            'middle_name', 'last_name', 'username', 'email', 'mobile',
            'is_tfa_enabled', 'is_email_verified', 'is_mobile_verified',
            'is_active', 'is_staff', 'created', 'updated', 'groups'
        )
        read_only = (
            'last_login','is_superuser', 'is_email_verified',
            'is_mobile_verified', 'is_active', 'is_staff',
            'created', 'updated'
        )
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


    def create(self, validated_data):
        """
        Create and return a new user
        :param validated_data:
        :return: User Object
        """
        if not 'username' in validated_data:
            validated_data['username'] = validated_data['email']
        else:
            if validated_data['username'] == None:
                validated_data['username'] = validated_data['email']


        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        if 'password' in validated_data:
            if validated_data['password'] != None:
                user.set_password(validated_data['password'])
        
        user.save()
        
        return user

    
    def update(self, instance, validated_data):
        user = super(UserSerializer, self).update(instance, validated_data);

        if 'password' in validated_data:
            if validated_data['password'] != None:
                user.set_password(validated_data['password']);
                user.save();

        return user;