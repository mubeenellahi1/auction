# Generated by Django 3.1.4 on 2021-01-07 20:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0006_order_orderproduct'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='order_date',
        ),
    ]
