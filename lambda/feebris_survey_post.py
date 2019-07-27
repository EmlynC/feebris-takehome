import json
import boto3
import logging
from datetime import datetime

def handler(event, context):
    
    data = event
    print(data)
    print(type(data))
    
    if not data:
        return json.dumps({'error': "A survey payload is required"})
    
    # validation
    for prop in ['hasCough', 'hasFever', 'temperature']:
        missing_props = []
        
        if prop not in data:
            missing_props = missing_props.append(prop)
           
        if missing_props:
            return json.dumps({'error': f"{''.join(missing_props)} properties are required."})
    
    # add submitted at
    submitted_at = datetime.utcnow().isoformat()
    data['submittedAt'] = submitted_at
    payload = json.dumps(data)
    
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('feebris-survey-results')
    
    bucket.put_object(
        Key=f'survey_{submitted_at}.json',
        Body=payload,
        ContentType='application/json',
    )
    
    return payload
