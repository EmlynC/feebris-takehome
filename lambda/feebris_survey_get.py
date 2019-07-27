import json
import boto3
import logging

def handler(event, context):
    
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('feebris-survey-results')
    
    objects = []
    
    for object_summary in bucket.objects.all():
        objects.append(json.load(object_summary.get().get('Body')))
        
    return json.dumps(objects)
