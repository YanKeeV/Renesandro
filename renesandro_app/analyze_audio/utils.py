import whisper
import spacy

def analyze_audio_and_generate_prompts(audio_path):

    model = whisper.load_model("base")

    result = model.transcribe(audio_path)

    text = result['text']
    
    nlp = spacy.load("en_core_web_sm")

    doc = nlp(text)

    key_prompts = set()
    
    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN']:
            key_prompts.add(token.text)
    
    for ent in doc.ents:
        key_prompts.add(ent.text)

    return list(key_prompts)
