# Generated by Django 3.2.7 on 2021-09-17 09:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_alter_chat_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatmessage',
            name='chat',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='main.chat'),
        ),
    ]
