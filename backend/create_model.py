#!/usr/bin/env python3
"""
Script to create a pre-trained disease prediction model
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import os

def create_pretrained_model():
    """Create and save a pre-trained model"""
    
    # Comprehensive disease data with more diseases and specializations
    disease_data = {
        'Disease': [
            # Respiratory Diseases
            'Common Cold', 'Influenza', 'COVID-19', 'Pneumonia', 'Bronchitis', 'Asthma', 'Tuberculosis',
            'Sinusitis', 'Allergic Rhinitis', 'Whooping Cough', 'Lung Cancer', 'Pulmonary Embolism',
            'Chronic Obstructive Pulmonary Disease', 'Pleurisy', 'Pneumothorax',
            
            # Neurological Diseases
            'Migraine', 'Tension Headache', 'Epilepsy', 'Stroke', 'Parkinson Disease', 'Alzheimer Disease',
            'Multiple Sclerosis', 'Meningitis', 'Brain Tumor', 'Vertigo', 'Trigeminal Neuralgia',
            'Bell Palsy', 'Huntington Disease', 'Amyotrophic Lateral Sclerosis', 'Neuropathy',
            
            # Cardiovascular Diseases
            'Hypertension', 'Heart Disease', 'Heart Attack', 'Arrhythmia', 'Heart Failure', 'Angina',
            'Deep Vein Thrombosis', 'Varicose Veins', 'Peripheral Artery Disease', 'Atrial Fibrillation',
            'Cardiomyopathy', 'Pericarditis', 'Aortic Stenosis', 'Mitral Valve Prolapse',
            
            # Gastrointestinal Diseases
            'Gastritis', 'Peptic Ulcer', 'GERD', 'IBS', 'Crohn Disease', 'Ulcerative Colitis',
            'Appendicitis', 'Gallstones', 'Hepatitis', 'Food Poisoning', 'Celiac Disease',
            'Diverticulitis', 'Pancreatitis', 'Cirrhosis', 'Colon Cancer', 'Stomach Cancer',
            
            # Endocrine Diseases
            'Diabetes Type 1', 'Diabetes Type 2', 'Hyperthyroidism', 'Hypothyroidism', 'PCOS',
            'Adrenal Insufficiency', 'Cushing Syndrome', 'Goiter', 'Diabetic Ketoacidosis',
            'Hypoglycemia', 'Metabolic Syndrome', 'Growth Hormone Deficiency',
            
            # Dermatological Diseases
            'Eczema', 'Psoriasis', 'Acne', 'Dermatitis', 'Fungal Infection', 'Bacterial Skin Infection',
            'Skin Cancer', 'Vitiligo', 'Rosacea', 'Herpes Simplex', 'Shingles', 'Warts',
            'Seborrheic Dermatitis', 'Hives', 'Impetigo', 'Cellulitis',
            
            # Orthopedic Diseases
            'Arthritis', 'Osteoporosis', 'Fracture', 'Sprain', 'Back Pain', 'Neck Pain',
            'Carpal Tunnel Syndrome', 'Tennis Elbow', 'Fibromyalgia', 'Osteoarthritis',
            'Rheumatoid Arthritis', 'Gout', 'Bursitis', 'Tendinitis', 'Scoliosis',
            
            # Psychiatric Diseases
            'Depression', 'Anxiety', 'Bipolar Disorder', 'Schizophrenia', 'PTSD', 'OCD',
            'Panic Disorder', 'ADHD', 'Eating Disorders', 'Seasonal Affective Disorder',
            'Social Anxiety Disorder', 'Generalized Anxiety Disorder', 'Autism Spectrum Disorder',
            
            # Urological Diseases
            'UTI', 'Kidney Stones', 'Prostate Enlargement', 'Bladder Infection', 'Kidney Disease',
            'Prostate Cancer', 'Bladder Cancer', 'Erectile Dysfunction', 'Incontinence',
            'Interstitial Cystitis', 'Pyelonephritis', 'Hydronephrosis',
            
            # Gynecological Diseases
            'Menstrual Disorders', 'Endometriosis', 'Ovarian Cysts', 'Breast Cancer', 'Cervical Cancer',
            'Uterine Fibroids', 'Pelvic Inflammatory Disease', 'Vaginitis', 'Menopause',
            'Ovarian Cancer', 'Vulvodynia', 'Bartholin Cyst', 'Adenomyosis',
            
            # Ophthalmological Diseases
            'Conjunctivitis', 'Glaucoma', 'Cataracts', 'Dry Eyes', 'Retinal Detachment',
            'Macular Degeneration', 'Diabetic Retinopathy', 'Stye', 'Chalazion', 'Uveitis',
            'Keratitis', 'Ptosis',
            
            # ENT Diseases
            'Ear Infection', 'Hearing Loss', 'Tinnitus', 'Throat Infection', 'Tonsillitis',
            'Laryngitis', 'Deviated Septum', 'Sleep Apnea', 'Nasal Polyps', 'Vertigo',
            'Meniere Disease', 'Vocal Cord Paralysis',
            
            # Nephrology Diseases
            'Chronic Kidney Disease', 'Acute Kidney Injury', 'Glomerulonephritis', 'Nephrotic Syndrome',
            'Polycystic Kidney Disease', 'Kidney Failure', 'Dialysis Complications', 'Renal Colic',
            
            # Hematology Diseases
            'Anemia', 'Leukemia', 'Lymphoma', 'Thrombocytopenia', 'Hemophilia', 'Sickle Cell Disease',
            'Thalassemia', 'Iron Deficiency', 'Vitamin B12 Deficiency',
            
            # Infectious Diseases
            'Malaria', 'Dengue Fever', 'Typhoid', 'Chickenpox', 'Measles', 'Mumps', 'Rubella',
            'Hepatitis A', 'Hepatitis B', 'Hepatitis C', 'HIV/AIDS', 'Mononucleosis',
            
            # Rheumatology Diseases
            'Lupus', 'Sjögren Syndrome', 'Scleroderma', 'Vasculitis', 'Polymyalgia Rheumatica',
            'Ankylosing Spondylitis', 'Reactive Arthritis',
            
            # Pediatric Diseases
            'Colic', 'Diaper Rash', 'Hand Foot Mouth Disease', 'Roseola', 'Croup',
            'Bronchiolitis', 'Febrile Seizures', 'Growing Pains',
            
            # Geriatric Diseases
            'Dementia', 'Osteomalacia', 'Presbyopia', 'Presbycusis', 'Sarcopenia',
            'Frailty Syndrome', 'Polypharmacy Effects'
        ],
        'Symptoms': [
            # Additional Respiratory symptoms with 50+ new symptoms
            'fever,cough,runny nose,sore throat,sneezing,fatigue,nasal congestion,body aches,chills,malaise',
            'high fever,body aches,headache,fatigue,cough,sore throat,chills,muscle pain,weakness,joint stiffness',
            'fever,dry cough,fatigue,loss of taste,loss of smell,difficulty breathing,body aches,headache,sore throat,chest tightness',
            'high fever,chest pain,cough with phlegm,difficulty breathing,fatigue,chills,rapid breathing,confusion,sweating,rigors',
            'persistent cough,mucus production,fatigue,chest discomfort,shortness of breath,wheezing,morning stiffness,throat irritation',
            'wheezing,shortness of breath,chest tightness,coughing,difficulty breathing,rapid breathing,anxiety,exercise intolerance',
            'persistent cough,chest pain,coughing blood,fever,night sweats,weight loss,fatigue,loss of appetite,hoarseness,lymph node swelling',
            'facial pain,nasal congestion,headache,thick nasal discharge,reduced sense of smell,tooth pain,ear pressure,post-nasal drip',
            'sneezing,runny nose,itchy eyes,nasal congestion,watery eyes,scratchy throat,postnasal drip,seasonal symptoms',
            'severe coughing fits,whooping sound,vomiting after coughing,fever,runny nose,red eyes,exhaustion,sleep disturbance',
            'persistent cough,chest pain,shortness of breath,weight loss,fatigue,coughing blood,hoarseness,bone pain',
            'sudden shortness of breath,chest pain,rapid heartbeat,coughing blood,leg swelling,dizziness,fainting,anxiety attacks',
            'chronic cough,shortness of breath,wheezing,chest tightness,fatigue,frequent respiratory infections,barrel chest,cyanosis',
            'sharp chest pain,difficulty breathing,dry cough,rapid heartbeat,anxiety,shoulder pain,stabbing pain,shallow breathing',
            'sudden chest pain,shortness of breath,rapid breathing,anxiety,chest tightness,cyanosis,air hunger,panic sensation',
            
            # Enhanced Neurological symptoms with additional symptoms
            'severe headache,nausea,vomiting,sensitivity to light,sensitivity to sound,visual disturbances,dizziness,aura symptoms',
            'dull headache,pressure around forehead,neck pain,shoulder pain,fatigue,irritability,difficulty concentrating,scalp tenderness',
            'seizures,loss of consciousness,confusion,muscle stiffness,tongue biting,incontinence,memory problems,post-ictal confusion',
            'sudden weakness,speech problems,vision problems,confusion,severe headache,numbness,difficulty walking,facial drooping',
            'tremors,muscle stiffness,slow movement,balance problems,difficulty walking,masked face,soft speech,freezing episodes',
            'memory loss,confusion,difficulty speaking,personality changes,disorientation,wandering,agitation,sundowning',
            'muscle weakness,numbness,vision problems,fatigue,difficulty walking,balance problems,cognitive issues,heat sensitivity',
            'severe headache,neck stiffness,fever,nausea,vomiting,sensitivity to light,confusion,rash,altered consciousness',
            'headache,seizures,nausea,vomiting,vision problems,personality changes,weakness,speech problems,cognitive decline',
            'dizziness,spinning sensation,nausea,balance problems,hearing problems,tinnitus,sweating,motion sensitivity',
            'severe facial pain,electric shock sensation,trigger points,muscle spasms,sensitivity to touch,jaw pain',
            'sudden facial weakness,drooping mouth,inability to close eye,loss of taste,drooling,speech difficulties',
            'involuntary movements,personality changes,cognitive decline,difficulty swallowing,depression,behavioral changes',
            'muscle weakness,difficulty speaking,difficulty swallowing,muscle cramps,twitching,fatigue,respiratory weakness',
            'numbness,tingling,burning pain,weakness,loss of reflexes,balance problems,sensitivity to touch,muscle atrophy',
            
            # Enhanced Cardiovascular symptoms with additional symptoms
            'headache,dizziness,chest pain,shortness of breath,nosebleeds,blurred vision,fatigue,pounding heartbeat',
            'chest pain,shortness of breath,fatigue,irregular heartbeat,swelling in legs,rapid heartbeat,weakness,exercise intolerance',
            'severe chest pain,shortness of breath,nausea,sweating,pain in arm,jaw pain,dizziness,weakness,crushing sensation',
            'irregular heartbeat,palpitations,dizziness,chest pain,shortness of breath,fainting,fatigue,skipped beats',
            'shortness of breath,fatigue,swelling in legs,rapid heartbeat,cough,difficulty sleeping flat,weight gain,orthopnea',
            'chest pain,shortness of breath,pain in arm,jaw pain,sweating,nausea,pressure in chest,burning sensation',
            'leg pain,swelling,warmth,redness,tenderness in leg,skin discoloration,heaviness,cramping',
            'visible swollen veins,leg pain,heaviness in legs,itching around veins,skin changes,cramping,restless legs',
            'leg pain when walking,cold feet,weak pulse in legs,numbness,skin color changes,slow healing wounds,claudication',
            'irregular heartbeat,palpitations,shortness of breath,chest pain,dizziness,fatigue,confusion,rapid pulse',
            'shortness of breath,chest pain,fatigue,swelling,irregular heartbeat,dizziness,fainting,fluid retention',
            'chest pain,fever,shortness of breath,rapid heartbeat,fatigue,dry cough,difficulty lying flat,friction rub',
            'chest pain,shortness of breath,dizziness,fainting,fatigue,rapid heartbeat,leg swelling,syncope',
            'chest pain,palpitations,shortness of breath,dizziness,fatigue,anxiety,mitral regurgitation murmur,click sound',
            
            # Enhanced Gastrointestinal symptoms with additional symptoms
            'stomach pain,nausea,vomiting,bloating,loss of appetite,heartburn,indigestion,belching,acid reflux',
            'stomach pain,nausea,vomiting,bloating,black stools,loss of appetite,heartburn,weight loss,tarry stools',
            'heartburn,chest pain,difficulty swallowing,regurgitation,chronic cough,sore throat,hoarseness,bitter taste',
            'abdominal pain,diarrhea,constipation,bloating,gas,cramping,mucus in stool,urgency,incomplete evacuation',
            'abdominal pain,diarrhea,weight loss,fatigue,fever,blood in stool,mouth sores,joint pain,perianal disease',
            'abdominal pain,diarrhea,blood in stool,urgency,weight loss,fatigue,fever,joint pain,tenesmus',
            'severe abdominal pain,nausea,vomiting,fever,loss of appetite,constipation,abdominal tenderness,rebound pain',
            'severe abdominal pain,nausea,vomiting,fever,jaundice,clay-colored stools,dark urine,biliary colic',
            'fatigue,jaundice,abdominal pain,nausea,loss of appetite,dark urine,pale stools,joint pain,malaise',
            'nausea,vomiting,diarrhea,abdominal cramps,fever,dehydration,headache,muscle aches,food aversion',
            'abdominal pain,diarrhea,weight loss,fatigue,bloating,gas,nutrient deficiencies,skin rash,bone pain',
            'abdominal pain,fever,constipation,nausea,vomiting,bloating,changes in bowel habits,rectal bleeding',
            'severe abdominal pain,nausea,vomiting,fever,rapid pulse,abdominal tenderness,back pain,pancreatic enzymes',
            'fatigue,jaundice,abdominal swelling,confusion,easy bruising,spider veins,fluid retention,portal hypertension',
            'abdominal pain,changes in bowel habits,blood in stool,weight loss,fatigue,narrow stools,iron deficiency',
            'stomach pain,nausea,vomiting,loss of appetite,weight loss,feeling full quickly,bloating,early satiety',
            
            # Enhanced Endocrine symptoms with additional symptoms
            'frequent urination,excessive thirst,fatigue,blurred vision,slow healing wounds,weight loss,increased hunger,ketones in urine',
            'frequent urination,excessive thirst,fatigue,blurred vision,slow healing wounds,weight gain,tingling,peripheral neuropathy',
            'weight loss,rapid heartbeat,sweating,nervousness,tremors,heat intolerance,bulging eyes,irritability,palpitations',
            'weight gain,fatigue,cold intolerance,dry skin,hair loss,depression,constipation,muscle weakness,bradycardia',
            'irregular periods,weight gain,acne,excessive hair growth,infertility,mood changes,insulin resistance,male pattern baldness',
            'fatigue,weight loss,low blood pressure,nausea,muscle weakness,salt cravings,dizziness,hyperpigmentation',
            'weight gain,high blood pressure,diabetes,purple stretch marks,mood changes,muscle weakness,easy bruising,moon face',
            'neck swelling,difficulty swallowing,hoarseness,breathing problems,cough,weight changes,thyroid nodules',
            'nausea,vomiting,abdominal pain,dehydration,rapid breathing,fruity breath odor,confusion,altered consciousness',
            'shakiness,sweating,rapid heartbeat,anxiety,dizziness,hunger,confusion,irritability,weakness',
            'abdominal obesity,high blood pressure,high blood sugar,abnormal cholesterol,insulin resistance,fatty liver',
            'short stature,delayed puberty,muscle weakness,increased fat,decreased bone density,fatigue,growth retardation',
            
            # Enhanced Dermatological symptoms with additional symptoms
            'itchy skin,red patches,dry skin,scaling,inflammation,rash,burning sensation,oozing,skin thickening',
            'red scaly patches,itching,thick skin,silvery scales,joint pain,nail changes,bleeding,plaques',
            'pimples,blackheads,whiteheads,oily skin,scarring,inflammation,cysts,nodules,comedones',
            'red itchy rash,swelling,blisters,burning sensation,dry skin,scaling,oozing,contact sensitivity',
            'itchy skin,scaling,redness,cracking,burning sensation,odor,nail changes,athlete foot',
            'red swollen skin,pus,warmth,tenderness,fever,pain,streaking,lymph node swelling,cellulitis',
            'unusual mole,changing mole,bleeding mole,itchy skin,new growth,asymmetrical lesion,irregular borders',
            'white patches on skin,loss of pigmentation,premature graying,sun sensitivity,autoimmune markers',
            'facial redness,visible blood vessels,bumps,burning sensation,eye irritation,thickened skin,rhinophyma',
            'painful blisters,burning sensation,tingling,fever,headache,swollen lymph nodes,vesicles',
            'painful rash,burning sensation,tingling,fever,headache,sensitivity to touch,postherpetic neuralgia',
            'skin growths,rough texture,painless bumps,spreading lesions,bleeding,viral warts',
            'scaly patches,itching,redness,greasy appearance,flaking,burning sensation,dandruff',
            'raised welts,itching,swelling,redness,burning sensation,difficulty breathing,angioedema',
            'red streaking,warmth,swelling,pain,fever,chills,lymph node swelling,tissue necrosis',
            'red streaking,warmth,swelling,pain,fever,chills,lymph node swelling',
            
            # Orthopedic
            'joint pain,stiffness,swelling,reduced range of motion,fatigue,morning stiffness,warmth',
            'bone pain,fractures,height loss,stooped posture,back pain,muscle weakness,dental problems',
            'severe pain,swelling,deformity,inability to move,bruising,numbness,tingling',
            'joint pain,swelling,limited movement,bruising,tenderness,instability,popping sound',
            'lower back pain,muscle spasms,stiffness,pain radiating to legs,numbness,weakness',
            'neck pain,stiffness,headache,muscle spasms,limited movement,arm pain,numbness',
            'wrist pain,numbness,tingling,weakness in hand,night pain,difficulty gripping',
            'elbow pain,tenderness,stiffness,weakness in grip,pain when lifting,swelling',
            'widespread pain,fatigue,sleep problems,tender points,stiffness,cognitive issues,headaches',
            'joint pain,stiffness,bone spurs,reduced range of motion,grinding sensation,muscle weakness',
            'joint pain,swelling,morning stiffness,fatigue,fever,weight loss,symmetrical involvement',
            'sudden severe joint pain,swelling,redness,warmth,fever,limited movement,tophi',
            'joint pain,swelling,limited movement,warmth,tenderness,fluid accumulation',
            'pain,swelling,stiffness,warmth,limited movement,muscle weakness,clicking sounds',
            'back pain,uneven shoulders,uneven hips,rib prominence,breathing problems,fatigue',
            
            # Psychiatric
            'persistent sadness,loss of interest,fatigue,sleep problems,appetite changes,guilt,hopelessness,suicidal thoughts',
            'excessive worry,restlessness,fatigue,difficulty concentrating,muscle tension,irritability,sleep problems',
            'mood swings,manic episodes,depression,sleep problems,impulsive behavior,grandiosity,racing thoughts',
            'hallucinations,delusions,disorganized thinking,social withdrawal,agitation,poor hygiene,flat affect',
            'flashbacks,nightmares,anxiety,avoidance,hypervigilance,sleep problems,emotional numbing,irritability',
            'obsessive thoughts,compulsive behaviors,anxiety,repetitive actions,distress,time-consuming rituals',
            'sudden intense fear,rapid heartbeat,sweating,trembling,shortness of breath,chest pain,dizziness',
            'inattention,hyperactivity,impulsivity,difficulty focusing,restlessness,disorganization,forgetfulness',
            'restricted eating,binge eating,purging,body image distortion,weight preoccupation,social withdrawal',
            'seasonal depression,fatigue,oversleeping,weight gain,carbohydrate cravings,social withdrawal',
            'fear of social situations,blushing,sweating,trembling,nausea,avoidance,self-consciousness',
            'persistent worry,restlessness,fatigue,muscle tension,sleep problems,irritability,difficulty concentrating',
            'social communication difficulties,repetitive behaviors,sensory sensitivities,routine adherence,special interests',
            
            # Urological
            'burning urination,frequent urination,cloudy urine,pelvic pain,fever,urgency,strong-smelling urine',
            'severe back pain,nausea,vomiting,blood in urine,frequent urination,burning urination,fever',
            'difficulty urinating,weak stream,frequent urination,incomplete emptying,nocturia,urgency',
            'burning urination,frequent urination,urgency,pelvic pain,cloudy urine,blood in urine',
            'fatigue,swelling,changes in urination,high blood pressure,nausea,loss of appetite,itching',
            'difficulty urinating,blood in urine,bone pain,weight loss,fatigue,frequent urination',
            'blood in urine,frequent urination,urgency,pelvic pain,back pain,weight loss',
            'difficulty achieving erection,reduced sexual desire,performance anxiety,relationship problems',
            'involuntary urine leakage,frequent urination,urgency,nocturia,pelvic pressure',
            'pelvic pain,frequent urination,urgency,painful intercourse,bladder pressure',
            'flank pain,fever,nausea,vomiting,frequent urination,burning urination,chills',
            'flank pain,abdominal swelling,high blood pressure,decreased urine output,nausea',
            
            # Gynecological
            'irregular periods,heavy bleeding,pelvic pain,mood changes,bloating,breast tenderness,cramping',
            'pelvic pain,heavy periods,pain during intercourse,infertility,fatigue,bowel problems',
            'pelvic pain,bloating,frequent urination,irregular periods,nausea,back pain',
            'breast lump,breast pain,nipple discharge,breast changes,swollen lymph nodes,skin dimpling',
            'abnormal bleeding,pelvic pain,pain during intercourse,unusual discharge,weight loss',
            'heavy periods,pelvic pressure,frequent urination,constipation,back pain,enlarged abdomen',
            'pelvic pain,fever,abnormal discharge,painful intercourse,irregular bleeding,nausea',
            'vaginal itching,burning,abnormal discharge,painful urination,odor,irritation',
            'hot flashes,night sweats,mood changes,irregular periods,vaginal dryness,sleep problems',
            'abdominal bloating,pelvic pain,feeling full quickly,frequent urination,back pain,fatigue',
            'vulvar pain,burning,stinging,rawness,painful intercourse,sitting discomfort',
            'vulvar swelling,pain,tenderness,difficulty walking,sitting discomfort,fever',
            'heavy painful periods,enlarged uterus,pelvic pressure,back pain,frequent urination',
            
            # Ophthalmological
            'red eyes,itching,discharge,tearing,burning sensation,blurred vision,light sensitivity',
            'eye pain,blurred vision,halos around lights,nausea,headache,rainbow vision,tunnel vision',
            'cloudy vision,glare sensitivity,difficulty seeing at night,double vision,faded colors',
            'dry eyes,burning sensation,itching,redness,blurred vision,gritty feeling,tearing',
            'sudden vision loss,flashing lights,floaters,curtain over vision,shadow in vision',
            'central vision loss,difficulty reading,straight lines appear wavy,dark spots,color changes',
            'blurred vision,floaters,dark spots,difficulty seeing at night,fluctuating vision',
            'eyelid bump,pain,swelling,redness,tearing,light sensitivity,discharge',
            'painless eyelid bump,swelling,blurred vision,pressure sensation,cosmetic concern',
            'eye pain,redness,light sensitivity,blurred vision,tearing,headache,floaters',
            'eye pain,redness,light sensitivity,blurred vision,tearing,foreign body sensation',
            'drooping eyelid,vision obstruction,eye fatigue,compensatory head position,cosmetic concern',
            
            # ENT
            'ear pain,fever,hearing loss,discharge from ear,irritability,balance problems,fullness',
            'gradual hearing loss,difficulty understanding speech,tinnitus,dizziness,social isolation',
            'ringing in ears,buzzing sounds,hearing problems,dizziness,headache,sleep problems',
            'sore throat,difficulty swallowing,fever,swollen glands,hoarse voice,ear pain',
            'sore throat,difficulty swallowing,fever,swollen tonsils,bad breath,drooling,muffled voice',
            'hoarse voice,throat pain,dry cough,voice fatigue,difficulty speaking,throat clearing',
            'nasal congestion,difficulty breathing,snoring,facial pain,reduced sense of smell',
            'loud snoring,breathing pauses,daytime sleepiness,morning headaches,difficulty concentrating',
            'nasal congestion,runny nose,facial pressure,reduced sense of smell,snoring',
            'dizziness,spinning sensation,nausea,balance problems,hearing problems,tinnitus',
            'hearing loss,tinnitus,dizziness,ear fullness,nausea,balance problems',
            'hoarse voice,breathy voice,voice fatigue,difficulty speaking loudly,aspiration',
            
            # Nephrology
            'fatigue,swelling,decreased urine output,nausea,loss of appetite,high blood pressure,itching',
            'sudden decrease in urine output,swelling,nausea,confusion,chest pain,shortness of breath',
            'blood in urine,swelling,high blood pressure,fatigue,decreased urine output,foamy urine',
            'swelling,protein in urine,fatigue,loss of appetite,weight gain,high cholesterol',
            'abdominal pain,blood in urine,high blood pressure,kidney stones,urinary tract infections',
            'severe fatigue,nausea,vomiting,loss of appetite,difficulty concentrating,muscle cramps',
            'fatigue,nausea,muscle cramps,bone pain,anemia,high blood pressure,fluid retention',
            'severe flank pain,nausea,vomiting,blood in urine,fever,frequent urination',
            
            # Hematology
            'fatigue,weakness,pale skin,shortness of breath,cold hands and feet,brittle nails,headache',
            'fatigue,frequent infections,easy bruising,weight loss,swollen lymph nodes,night sweats',
            'swollen lymph nodes,fatigue,weight loss,night sweats,fever,itching,chest pain',
            'easy bruising,bleeding,fatigue,frequent infections,small red spots on skin',
            'easy bruising,prolonged bleeding,joint pain,swelling,nosebleeds,heavy periods',
            'severe pain episodes,fatigue,swelling,frequent infections,delayed growth,jaundice',
            'fatigue,weakness,pale skin,shortness of breath,heart palpitations,jaundice',
            'fatigue,weakness,pale skin,shortness of breath,restless legs,ice cravings',
            'fatigue,weakness,numbness,tingling,difficulty walking,memory problems,pale skin',
            
            # Infectious Diseases
            'high fever,chills,sweating,headache,muscle aches,nausea,vomiting,fatigue',
            'high fever,severe headache,muscle pain,nausea,vomiting,skin rash,bleeding',
            'high fever,headache,abdominal pain,constipation,rose-colored rash,weakness',
            'fever,itchy rash,blisters,fatigue,headache,loss of appetite,malaise',
            'fever,cough,runny nose,red eyes,skin rash,white spots in mouth',
            'fever,swollen salivary glands,headache,muscle aches,difficulty chewing',
            'fever,skin rash,swollen lymph nodes,joint pain,red eyes,headache',
            'fatigue,nausea,abdominal pain,loss of appetite,dark urine,pale stools,jaundice',
            'fatigue,nausea,abdominal pain,joint pain,dark urine,jaundice,fever',
            'fatigue,abdominal pain,nausea,joint pain,dark urine,jaundice,loss of appetite',
            'fatigue,weight loss,frequent infections,night sweats,swollen lymph nodes,diarrhea',
            'fever,sore throat,swollen lymph nodes,fatigue,body aches,loss of appetite',
            
            # Rheumatology
            'joint pain,skin rash,fatigue,fever,hair loss,mouth sores,kidney problems,sensitivity to light',
            'dry eyes,dry mouth,joint pain,fatigue,skin rash,difficulty swallowing',
            'skin thickening,joint pain,difficulty swallowing,heartburn,cold fingers,fatigue',
            'fever,weight loss,fatigue,muscle aches,skin rash,nerve problems,kidney problems',
            'muscle pain,stiffness,headache,fatigue,weight loss,depression,jaw pain',
            'back pain,stiffness,fatigue,eye inflammation,skin rash,bowel problems',
            'joint pain,eye inflammation,skin rash,mouth sores,genital sores,fatigue',
            
            # Pediatric
            'excessive crying,fussiness,difficulty feeding,gas,pulling legs to chest,evening symptoms',
            'red irritated skin,rash,discomfort,crying during diaper changes,strong odor',
            'fever,mouth sores,skin rash on hands and feet,sore throat,loss of appetite',
            'fever,skin rash,irritability,loss of appetite,runny nose,cough',
            'barking cough,difficulty breathing,hoarse voice,fever,stridor,restlessness',
            'difficulty breathing,wheezing,cough,fever,poor feeding,irritability',
            'fever,seizure,loss of consciousness,muscle stiffness,confusion,sleepiness',
            'leg pain,muscle aches,restlessness,difficulty sleeping,normal activity during day',
            
            # Geriatric
            'memory loss,confusion,difficulty with daily tasks,personality changes,wandering,agitation',
            'bone pain,muscle weakness,difficulty walking,fractures,dental problems,fatigue',
            'difficulty seeing close objects,eye strain,headaches,need for reading glasses',
            'difficulty hearing,asking for repetition,turning up volume,social withdrawal',
            'muscle weakness,fatigue,slow walking,weight loss,decreased activity,frailty',
            'weakness,fatigue,unintentional weight loss,slow walking,low activity,exhaustion',
            'medication side effects,drug interactions,confusion,falls,dizziness,nausea'
        ],
        'Specialization': [
            # Respiratory
            'Pulmonologist', 'Pulmonologist', 'Pulmonologist', 'Pulmonologist', 'Pulmonologist', 
            'Pulmonologist', 'Pulmonologist', 'ENT Specialist', 'Allergist', 'Pulmonologist',
            'Oncologist', 'Pulmonologist', 'Pulmonologist', 'Pulmonologist', 'Pulmonologist',
            
            # Neurological
            'Neurologist', 'Neurologist', 'Neurologist', 'Neurologist', 'Neurologist', 
            'Neurologist', 'Neurologist', 'Neurologist', 'Neurosurgeon', 'Neurologist',
            'Neurologist', 'Neurologist', 'Neurologist', 'Neurologist', 'Neurologist',
            
            # Cardiovascular
            'Cardiologist', 'Cardiologist', 'Cardiologist', 'Cardiologist', 'Cardiologist',
            'Cardiologist', 'Vascular Surgeon', 'Vascular Surgeon', 'Vascular Surgeon',
            'Cardiologist', 'Cardiologist', 'Cardiologist', 'Cardiologist', 'Cardiologist',
            
            # Gastrointestinal
            'Gastroenterologist', 'Gastroenterologist', 'Gastroenterologist', 'Gastroenterologist', 
            'Gastroenterologist', 'Gastroenterologist', 'General Surgeon', 'General Surgeon', 
            'Gastroenterologist', 'Gastroenterologist', 'Gastroenterologist', 'Gastroenterologist',
            'Gastroenterologist', 'Gastroenterologist', 'Oncologist', 'Oncologist',
            
            # Endocrine
            'Endocrinologist', 'Endocrinologist', 'Endocrinologist', 'Endocrinologist', 
            'Gynecologist', 'Endocrinologist', 'Endocrinologist', 'Endocrinologist',
            'Endocrinologist', 'Endocrinologist', 'Endocrinologist', 'Endocrinologist',
            
            # Dermatological
            'Dermatologist', 'Dermatologist', 'Dermatologist', 'Dermatologist', 'Dermatologist',
            'Dermatologist', 'Oncologist', 'Dermatologist', 'Dermatologist', 'Dermatologist',
            'Dermatologist', 'Dermatologist', 'Dermatologist', 'Dermatologist', 'Dermatologist',
            'Dermatologist',
            
            # Orthopedic
            'Rheumatologist', 'Orthopedic', 'Orthopedic', 'Orthopedic', 'Orthopedic',
            'Orthopedic', 'Orthopedic', 'Orthopedic', 'Rheumatologist', 'Orthopedic',
            'Rheumatologist', 'Rheumatologist', 'Orthopedic', 'Orthopedic', 'Orthopedic',
            
            # Psychiatric
            'Psychiatrist', 'Psychiatrist', 'Psychiatrist', 'Psychiatrist', 'Psychiatrist',
            'Psychiatrist', 'Psychiatrist', 'Psychiatrist', 'Psychiatrist', 'Psychiatrist',
            'Psychiatrist', 'Psychiatrist', 'Psychiatrist',
            
            # Urological
            'Urologist', 'Urologist', 'Urologist', 'Urologist', 'Nephrologist',
            'Oncologist', 'Oncologist', 'Urologist', 'Urologist', 'Urologist',
            'Nephrologist', 'Nephrologist',
            
            # Gynecological
            'Gynecologist', 'Gynecologist', 'Gynecologist', 'Oncologist', 'Gynecologist',
            'Gynecologist', 'Gynecologist', 'Gynecologist', 'Gynecologist', 'Gynecologist',
            'Gynecologist', 'Gynecologist', 'Gynecologist',
            
            # Ophthalmological
            'Ophthalmologist', 'Ophthalmologist', 'Ophthalmologist', 'Ophthalmologist', 'Ophthalmologist',
            'Ophthalmologist', 'Ophthalmologist', 'Ophthalmologist', 'Ophthalmologist', 'Ophthalmologist',
            'Ophthalmologist', 'Ophthalmologist',
            
            # ENT
            'ENT Specialist', 'ENT Specialist', 'ENT Specialist', 'ENT Specialist', 'ENT Specialist',
            'ENT Specialist', 'ENT Specialist', 'ENT Specialist', 'ENT Specialist', 'ENT Specialist',
            'ENT Specialist', 'ENT Specialist',
            
            # Nephrology
            'Nephrologist', 'Nephrologist', 'Nephrologist', 'Nephrologist', 'Nephrologist',
            'Nephrologist', 'Nephrologist', 'Nephrologist',
            
            # Hematology
            'Hematologist', 'Hematologist', 'Hematologist', 'Hematologist', 'Hematologist',
            'Hematologist', 'Hematologist', 'Hematologist', 'Hematologist',
            
            # Infectious Diseases
            'Infectious Disease Specialist', 'Infectious Disease Specialist', 'Infectious Disease Specialist',
            'Infectious Disease Specialist', 'Infectious Disease Specialist', 'Infectious Disease Specialist',
            'Infectious Disease Specialist', 'Infectious Disease Specialist', 'Infectious Disease Specialist',
            'Infectious Disease Specialist', 'Infectious Disease Specialist', 'Infectious Disease Specialist',
            
            # Rheumatology
            'Rheumatologist', 'Rheumatologist', 'Rheumatologist', 'Rheumatologist', 'Rheumatologist',
            'Rheumatologist', 'Rheumatologist',
            
            # Pediatric
            'Pediatrician', 'Pediatrician', 'Pediatrician', 'Pediatrician', 'Pediatrician',
            'Pediatrician', 'Pediatrician', 'Pediatrician',
            
            # Geriatric
            'Geriatrician', 'Geriatrician', 'Geriatrician', 'Geriatrician', 'Geriatrician',
            'Geriatrician', 'Geriatrician'
        ],
        'Description': [
            # Respiratory
            'Viral infection of upper respiratory tract',
            'Viral infection causing respiratory illness',
            'Coronavirus respiratory infection',
            'Lung infection causing inflammation',
            'Inflammation of bronchial tubes',
            'Chronic respiratory condition',
            'Bacterial lung infection',
            'Inflammation of sinus cavities',
            'Allergic reaction affecting nasal passages',
            'Bacterial infection causing severe cough',
            
            # Neurological
            'Severe recurring headaches',
            'Common stress-related headache',
            'Neurological disorder causing seizures',
            'Brain blood vessel blockage or rupture',
            'Progressive nervous system disorder',
            'Progressive brain disorder affecting memory',
            'Autoimmune disease affecting nervous system',
            'Inflammation of brain and spinal cord membranes',
            'Abnormal growth in brain tissue',
            'Inner ear disorder causing dizziness',
            
            # Cardiovascular
            'High blood pressure condition',
            'Cardiovascular system disorder',
            'Blockage of blood flow to heart muscle',
            'Irregular heart rhythm condition',
            'Heart unable to pump blood effectively',
            'Reduced blood flow to heart muscle',
            'Blood clot in deep veins',
            'Enlarged and twisted veins',
            'Narrowed arteries in limbs',
            
            # Gastrointestinal
            'Inflammation of stomach lining',
            'Sores in stomach or small intestine',
            'Stomach acid reflux into esophagus',
            'Functional bowel disorder',
            'Inflammatory bowel disease',
            'Inflammatory bowel disease affecting colon',
            'Inflammation of appendix',
            'Hardened deposits in gallbladder',
            'Liver inflammation',
            'Illness from contaminated food',
            
            # Endocrine
            'Autoimmune destruction of insulin-producing cells',
            'Insulin resistance and high blood sugar',
            'Overactive thyroid gland',
            'Underactive thyroid gland',
            'Hormonal disorder affecting ovaries',
            'Insufficient adrenal hormone production',
            'Excess cortisol production',
            
            # Dermatological
            'Chronic inflammatory skin condition',
            'Autoimmune skin condition with scaling',
            'Common skin condition affecting hair follicles',
            'Skin inflammation and irritation',
            'Fungal infection of skin',
            'Bacterial infection of skin tissue',
            'Malignant growth of skin cells',
            'Loss of skin pigmentation',
            'Chronic facial skin condition',
            
            # Orthopedic
            'Joint inflammation condition',
            'Bone density loss condition',
            'Break or crack in bone',
            'Stretched or torn ligament',
            'Pain in lower back region',
            'Pain and stiffness in neck',
            'Compressed nerve in wrist',
            'Inflammation of elbow tendons',
            'Chronic widespread muscle pain',
            
            # Psychiatric
            'Mental health disorder affecting mood',
            'Mental health disorder causing excessive worry',
            'Mental health disorder with mood swings',
            'Mental health disorder affecting perception',
            'Mental health disorder following trauma',
            'Mental health disorder with obsessions and compulsions',
            'Mental health disorder with panic attacks',
            'Neurodevelopmental disorder affecting attention',
            
            # Urological
            'Bacterial infection of urinary tract',
            'Hard deposits formed in kidneys',
            'Non-cancerous enlargement of prostate',
            'Bacterial infection of bladder',
            'Chronic kidney function decline',
            
            # Gynecological
            'Abnormal menstrual cycle patterns',
            'Uterine tissue growing outside uterus',
            'Fluid-filled sacs on ovaries',
            'Malignant tumor in breast tissue',
            'Malignant tumor in cervix',
            
            # Ophthalmological
            'Inflammation of eye surface',
            'Increased pressure in eye',
            'Clouding of eye lens',
            'Insufficient tear production',
            'Separation of retina from eye wall',
            
            # ENT
            'Bacterial or viral infection of ear',
            'Partial or complete loss of hearing',
            'Perception of sound without external source',
            'Bacterial or viral infection of throat',
            'Inflammation of tonsils',
            'Inflammation of voice box',
            'Nasal septum displacement',
            'Breathing disorder during sleep',
            'Benign growths in nasal cavity',
            'Inner ear disorder causing dizziness',
            'Inner ear disorder with hearing loss',
            'Paralysis of vocal cord muscles',
            
            # Additional Respiratory
            'Malignant tumor in lung tissue',
            'Blood clot in lung arteries',
            'Chronic lung disease with airway obstruction',
            'Inflammation of lung lining',
            'Collapsed lung condition',
            
            # Additional Neurological
            'Facial nerve inflammation',
            'Genetic neurodegenerative disorder',
            'Motor neuron disease',
            'Peripheral nerve damage',
            
            # Additional Cardiovascular
            'Irregular heart rhythm',
            'Heart muscle disease',
            'Heart lining inflammation',
            'Heart valve narrowing',
            'Heart valve prolapse',
            
            # Additional Gastrointestinal
            'Gluten sensitivity disorder',
            'Colon inflammation with pouches',
            'Pancreas inflammation',
            'Liver scarring and damage',
            'Large intestine malignancy',
            'Stomach malignancy',
            
            # Additional Endocrine
            'Severe diabetes complication',
            'Low blood sugar condition',
            'Multiple metabolic disorders',
            'Growth hormone deficiency',
            
            # Additional Dermatological
            'Viral skin infection',
            'Viral nerve infection with rash',
            'Viral skin growths',
            'Scalp skin inflammation',
            'Allergic skin reaction',
            'Bacterial skin infection',
            'Deep skin and tissue infection',
            
            # Additional Orthopedic
            'Degenerative joint disease',
            'Autoimmune joint disease',
            'Crystal arthritis',
            'Joint fluid sac inflammation',
            'Tendon inflammation',
            'Spinal curvature',
            
            # Additional Psychiatric
            'Eating behavior disorders',
            'Winter depression',
            'Social fear disorder',
            'Chronic anxiety disorder',
            'Developmental disorder',
            
            # Additional Urological
            'Malignant prostate tumor',
            'Malignant bladder tumor',
            'Male sexual dysfunction',
            'Bladder control loss',
            'Chronic bladder pain',
            'Kidney infection',
            'Kidney swelling',
            
            # Additional Gynecological
            'Uterine muscle tumors',
            'Pelvic infection',
            'Vaginal inflammation',
            'Female hormone changes',
            'Ovarian malignancy',
            'Vulvar pain syndrome',
            'Bartholin gland cyst',
            'Uterine muscle condition',
            
            # Additional Ophthalmological
            'Age-related vision loss',
            'Diabetes eye damage',
            'Eyelid infection',
            'Eyelid cyst',
            'Eye inflammation',
            'Corneal inflammation',
            'Eyelid drooping',
            
            # Nephrology
            'Progressive kidney function loss',
            'Sudden kidney function loss',
            'Kidney filter inflammation',
            'Kidney protein loss syndrome',
            'Genetic kidney cysts',
            'Complete kidney function loss',
            'Treatment-related complications',
            'Kidney stone pain',
            
            # Hematology
            'Low red blood cell count',
            'Blood cancer',
            'Lymph node cancer',
            'Low platelet count',
            'Blood clotting disorder',
            'Genetic blood disorder',
            'Genetic anemia',
            'Iron deficiency',
            'Vitamin deficiency anemia',
            
            # Infectious Diseases
            'Parasitic fever disease',
            'Mosquito-borne viral fever',
            'Bacterial systemic infection',
            'Viral skin rash disease',
            'Viral respiratory infection',
            'Viral salivary gland infection',
            'Viral skin rash disease',
            'Liver viral infection',
            'Liver viral infection',
            'Liver viral infection',
            'Immune system viral infection',
            'Viral throat infection',
            
            # Rheumatology
            'Autoimmune multi-system disease',
            'Autoimmune gland dysfunction',
            'Autoimmune skin hardening',
            'Blood vessel inflammation',
            'Muscle pain and stiffness',
            'Spinal joint inflammation',
            'Post-infection arthritis',
            
            # Pediatric
            'Infant digestive discomfort',
            'Infant skin irritation',
            'Childhood viral infection',
            'Childhood viral rash',
            'Childhood breathing difficulty',
            'Infant breathing difficulty',
            'Childhood fever seizures',
            'Childhood muscle pain',
            
            # Geriatric
            'Age-related memory loss',
            'Age-related bone softening',
            'Age-related near vision loss',
            'Age-related hearing loss',
            'Age-related muscle loss',
            'Age-related weakness syndrome',
            'Multiple medication effects',
            
            # Additional missing entries
            'Thyroid gland enlargement',
            'Severe low blood sugar emergency'
        ],
        'Precautions': [
            # Respiratory
            'rest,drink fluids,avoid cold exposure,maintain hygiene',
            'rest,antiviral medication,drink fluids,isolate yourself',
            'isolate,rest,monitor oxygen levels,seek medical help if severe',
            'antibiotics,rest,drink fluids,hospitalization if severe',
            'rest,drink fluids,avoid smoking,use humidifier',
            'use inhaler,avoid triggers,regular checkups,emergency plan',
            'antibiotics for months,isolation,nutritious diet,rest',
            'nasal irrigation,avoid allergens,use decongestants,rest',
            'avoid allergens,antihistamines,nasal sprays,clean environment',
            'antibiotics,isolation,supportive care,vaccination prevention',
            
            # Neurological
            'rest in dark room,pain medication,avoid triggers,stress management',
            'rest,pain relievers,stress management,massage',
            'medication compliance,avoid triggers,regular monitoring,safety precautions',
            'immediate medical attention,medication,rehabilitation,lifestyle changes',
            'medication,physical therapy,regular exercise,support groups',
            'medication,cognitive therapy,support groups,safety measures',
            'disease-modifying drugs,physical therapy,stress management,support',
            'immediate antibiotics,hospitalization,supportive care,monitoring',
            'surgery,radiation,chemotherapy,supportive care',
            'avoid sudden movements,medication,balance exercises,rest',
            
            # Cardiovascular
            'medication,low sodium diet,regular exercise,stress management',
            'medication,healthy diet,regular exercise,stress management',
            'immediate medical attention,medication,lifestyle changes,cardiac rehabilitation',
            'medication,avoid stimulants,regular monitoring,stress management',
            'medication,fluid restriction,low sodium diet,regular monitoring',
            'medication,avoid exertion,nitroglycerin,regular checkups',
            'blood thinners,compression stockings,elevation,avoid prolonged sitting',
            'compression stockings,elevation,avoid prolonged standing,exercise',
            'medication,exercise,avoid smoking,manage diabetes',
            
            # Gastrointestinal
            'avoid spicy foods,medication,stress management,small frequent meals',
            'medication,avoid NSAIDs,stress management,dietary changes',
            'avoid trigger foods,medication,elevate head while sleeping,weight management',
            'dietary changes,stress management,medication,regular exercise',
            'medication,dietary modifications,stress management,regular monitoring',
            'medication,dietary changes,stress management,regular colonoscopy',
            'immediate surgery,antibiotics,pain management,rest',
            'dietary changes,medication,avoid fatty foods,surgery if needed',
            'rest,avoid alcohol,medication,vaccination,proper hygiene',
            'hydration,rest,bland diet,avoid dairy,proper food handling',
            
            # Endocrine
            'insulin therapy,blood sugar monitoring,healthy diet,regular exercise',
            'medication,diet control,regular exercise,blood sugar monitoring',
            'medication,avoid iodine excess,regular monitoring,stress management',
            'hormone replacement,regular monitoring,healthy diet,exercise',
            'weight management,medication,regular exercise,dietary changes',
            'hormone replacement,stress management,regular monitoring,avoid infections',
            'medication,dietary changes,regular monitoring,stress management',
            
            # Dermatological
            'moisturize regularly,avoid triggers,medication,gentle skincare',
            'medication,avoid triggers,sun protection,stress management',
            'gentle cleansing,avoid picking,medication,healthy diet',
            'avoid irritants,moisturize,medication,identify triggers',
            'keep area clean and dry,antifungal medication,avoid sharing items',
            'antibiotics,keep wound clean,pain management,rest',
            'sun protection,regular skin checks,avoid tanning,early detection',
            'sun protection,stress management,support groups,cosmetic options',
            'avoid triggers,gentle skincare,sun protection,medication',
            
            # Orthopedic
            'anti-inflammatory medication,physical therapy,gentle exercise,rest',
            'calcium and vitamin D,weight-bearing exercise,fall prevention,medication',
            'immobilization,pain management,physical therapy,gradual return to activity',
            'rest,ice,compression,elevation,physical therapy',
            'physical therapy,pain management,proper posture,ergonomic support',
            'physical therapy,pain management,proper posture,stress management',
            'wrist splint,avoid repetitive motions,ergonomic workspace,exercises',
            'rest,ice,anti-inflammatory medication,avoid repetitive motions',
            'gentle exercise,stress management,sleep hygiene,pain management',
            
            # Psychiatric
            'therapy,medication,support groups,lifestyle changes',
            'therapy,relaxation techniques,medication,stress management',
            'medication,therapy,mood tracking,support groups',
            'medication,therapy,support groups,stress management',
            'therapy,medication,support groups,avoid triggers',
            'therapy,medication,exposure therapy,support groups',
            'therapy,medication,breathing techniques,avoid caffeine',
            'medication,behavioral therapy,structure,support groups',
            
            # Urological
            'antibiotics,drink plenty of water,proper hygiene,avoid irritants',
            'pain management,drink water,dietary changes,medical procedures',
            'medication,avoid caffeine,regular urination,lifestyle changes',
            'antibiotics,drink water,proper hygiene,avoid irritants',
            'medication,dietary changes,blood pressure control,regular monitoring',
            
            # Gynecological
            'hormone therapy,lifestyle changes,regular monitoring,stress management',
            'pain management,hormone therapy,surgery if needed,support groups',
            'regular monitoring,pain management,hormone therapy,surgery if needed',
            'surgery,chemotherapy,radiation,regular screening',
            'regular screening,vaccination,safe practices,early detection',
            
            # Ophthalmological
            'antibiotic drops,avoid touching eyes,proper hygiene,rest',
            'eye drops,regular monitoring,avoid strain,medication',
            'surgery,protective eyewear,regular checkups,manage other conditions',
            'artificial tears,avoid dry environments,blink frequently,humidifier',
            'immediate surgery,avoid sudden movements,follow-up care,protect eye',
            
            # ENT
            'antibiotics,pain management,avoid water in ear,rest',
            'hearing aids,avoid loud noises,regular checkups,communication strategies',
            'avoid loud noises,stress management,medication,sound therapy',
            'antibiotics,rest,warm saltwater gargle,avoid irritants',
            'antibiotics,rest,warm saltwater gargle,pain management',
            'voice rest,avoid irritants,humidifier,medication',
            'surgery,avoid trauma,breathing exercises,follow-up care',
            'weight loss,sleep position,CPAP machine,avoid alcohol',
            'surgery,avoid allergens,nasal irrigation,medication',
            'avoid sudden movements,medication,balance exercises,rest',
            'medication,hearing aids,balance therapy,avoid triggers',
            'speech therapy,voice rest,surgery if needed,avoid strain',
            
            # Additional Respiratory
            'surgery,chemotherapy,radiation,avoid smoking',
            'blood thinners,oxygen therapy,avoid immobility,medication',
            'bronchodilators,avoid smoking,pulmonary rehabilitation,oxygen therapy',
            'pain management,anti-inflammatory medication,rest,breathing exercises',
            'chest tube,avoid air travel,rest,follow-up care',
            
            # Additional Neurological
            'corticosteroids,physical therapy,eye protection,patience',
            'genetic counseling,supportive care,medication,family support',
            'supportive care,breathing assistance,communication aids,comfort care',
            'pain management,physical therapy,medication,avoid injury',
            
            # Additional Cardiovascular
            'medication,avoid stimulants,regular monitoring,stress management',
            'medication,lifestyle changes,regular monitoring,avoid alcohol',
            'anti-inflammatory medication,rest,avoid strenuous activity,monitoring',
            'surgery,medication,regular monitoring,avoid strenuous activity',
            'regular monitoring,medication,avoid strenuous activity,follow-up',
            
            # Additional Gastrointestinal
            'gluten-free diet,nutritional supplements,regular monitoring,support groups',
            'high-fiber diet,avoid triggers,medication,regular colonoscopy',
            'pain management,enzyme supplements,avoid alcohol,nutritional support',
            'avoid alcohol,medication,nutritional support,liver transplant if needed',
            'surgery,chemotherapy,radiation,regular screening',
            'surgery,chemotherapy,radiation,dietary changes',
            
            # Additional Endocrine
            'immediate medical attention,insulin,fluid replacement,monitoring',
            'glucose tablets,avoid skipping meals,medication adjustment,monitoring',
            'lifestyle changes,medication,regular monitoring,weight management',
            'hormone replacement,regular monitoring,nutritional support,exercise',
            
            # Additional Dermatological
            'antiviral medication,pain management,avoid scratching,rest',
            'antiviral medication,pain management,avoid contact,rest',
            'topical treatments,avoid picking,boost immunity,patience',
            'medicated shampoo,avoid harsh products,stress management,gentle care',
            'avoid triggers,antihistamines,topical treatments,identify cause',
            'antibiotics,keep clean,pain management,avoid spreading',
            'immediate antibiotics,hospitalization,wound care,pain management',
            
            # Additional Orthopedic
            'joint protection,exercise,weight management,pain medication',
            'disease-modifying drugs,exercise,joint protection,regular monitoring',
            'medication,dietary changes,avoid triggers,joint protection',
            'rest,ice,anti-inflammatory medication,physical therapy',
            'rest,anti-inflammatory medication,physical therapy,avoid overuse',
            'physical therapy,bracing,surgery if severe,regular monitoring',
            
            # Additional Psychiatric
            'therapy,nutritional rehabilitation,medical monitoring,family support',
            'light therapy,vitamin D,exercise,medication,routine',
            'therapy,gradual exposure,medication,support groups',
            'therapy,relaxation techniques,medication,stress management',
            'early intervention,behavioral therapy,educational support,family training',
            
            # Additional Urological
            'surgery,radiation,hormone therapy,regular monitoring',
            'surgery,chemotherapy,immunotherapy,regular monitoring',
            'medication,counseling,lifestyle changes,medical devices',
            'pelvic exercises,medication,behavioral training,surgery if needed',
            'pain management,dietary changes,bladder training,medication',
            'antibiotics,pain management,hydration,rest',
            'treat underlying cause,pain management,monitoring,surgery if needed',
            
            # Additional Gynecological
            'medication,surgery if needed,pain management,regular monitoring',
            'antibiotics,pain management,partner treatment,follow-up',
            'medication,hygiene,avoid irritants,partner treatment',
            'hormone therapy,lifestyle changes,symptom management,support',
            'surgery,chemotherapy,radiation,regular screening',
            'pain management,topical treatments,avoid triggers,support',
            'warm compresses,antibiotics if infected,surgery if needed,pain management',
            'medication,surgery if severe,pain management,regular monitoring',
            
            # Additional Ophthalmological
            'regular eye exams,lifestyle changes,supplements,low vision aids',
            'blood sugar control,regular eye exams,laser treatment,medication',
            'warm compresses,antibiotics,avoid touching,good hygiene',
            'warm compresses,massage,surgery if needed,patience',
            'medication,avoid triggers,regular monitoring,protect eyes',
            'medication,avoid contact lenses,good hygiene,follow-up',
            'surgery if severe,eye exercises,regular monitoring,protect eyes',
            
            # Nephrology
            'medication,dietary changes,blood pressure control,regular monitoring',
            'immediate medical attention,fluid management,treat underlying cause,dialysis if needed',
            'medication,blood pressure control,dietary changes,regular monitoring',
            'medication,dietary changes,regular monitoring,treat complications',
            'genetic counseling,blood pressure control,pain management,regular monitoring',
            'dialysis,kidney transplant,medication,dietary restrictions',
            'medication adjustment,infection prevention,regular monitoring,lifestyle changes',
            'pain management,hydration,medication,avoid triggers',
            
            # Hematology
            'iron supplements,dietary changes,treat underlying cause,regular monitoring',
            'chemotherapy,radiation,bone marrow transplant,supportive care',
            'chemotherapy,radiation,immunotherapy,supportive care',
            'medication,avoid injury,regular monitoring,treat underlying cause',
            'clotting factor replacement,avoid injury,genetic counseling,emergency plan',
            'pain management,hydration,avoid triggers,regular monitoring',
            'blood transfusions,iron chelation,genetic counseling,supportive care',
            'iron supplements,dietary changes,treat underlying cause,regular monitoring',
            'vitamin supplements,dietary changes,treat underlying cause,regular monitoring',
            
            # Infectious Diseases
            'antimalarial medication,mosquito control,rest,hydration',
            'supportive care,pain management,hydration,mosquito control',
            'antibiotics,supportive care,hydration,rest',
            'supportive care,isolation,rest,symptom management',
            'supportive care,rest,hydration,symptom management',
            'supportive care,rest,pain management,isolation',
            'supportive care,rest,isolation,symptom management',
            'supportive care,rest,avoid alcohol,vaccination',
            'supportive care,rest,avoid alcohol,vaccination',
            'supportive care,rest,avoid alcohol,vaccination',
            'antiretroviral therapy,regular monitoring,safe practices,support groups',
            'supportive care,rest,avoid contact sports,hydration',
            
            # Rheumatology
            'medication,sun protection,regular monitoring,stress management',
            'artificial tears,saliva substitutes,medication,regular monitoring',
            'medication,skin care,avoid cold,regular monitoring',
            'medication,regular monitoring,treat underlying cause,supportive care',
            'medication,gentle exercise,stress management,regular monitoring',
            'medication,exercise,posture training,regular monitoring',
            'medication,treat underlying infection,joint protection,regular monitoring',
            
            # Pediatric
            'comfort measures,feeding changes,soothing techniques,patience',
            'frequent diaper changes,barrier cream,gentle cleaning,air drying',
            'supportive care,isolation,rest,hydration',
            'supportive care,rest,fever management,isolation',
            'humidifier,upright position,calm environment,medical monitoring',
            'supportive care,humidifier,suction if needed,monitoring',
            'fever management,safety measures,medical evaluation,comfort',
            'reassurance,gentle massage,warm baths,age-appropriate activities',
            
            # Geriatric
            'cognitive stimulation,safety measures,routine,family support',
            'calcium and vitamin D,weight-bearing exercise,fall prevention,medication',
            'reading glasses,good lighting,regular eye exams,magnification aids',
            'hearing aids,reduce background noise,face-to-face communication,regular checkups',
            'protein intake,resistance exercise,physical therapy,nutritional support',
            'comprehensive care,fall prevention,medication review,social support',
            'medication review,regular monitoring,simplify regimen,education',
            
            # Additional missing entries
            'medication,surgery if severe,regular monitoring,avoid iodine excess',
            'immediate glucose,emergency medical care,avoid triggers,medication adjustment'
        ]
    }
    
    # Check array lengths before creating DataFrame
    print("Array lengths:")
    for key, value in disease_data.items():
        print(f"{key}: {len(value)}")
    
    # Create DataFrame
    df = pd.DataFrame(disease_data)
    
    # Extract all unique symptoms
    all_symptoms = set()
    for symptoms_str in df['Symptoms']:
        symptoms = [s.strip().lower() for s in symptoms_str.split(',')]
        all_symptoms.update(symptoms)
    
    symptom_list = sorted(all_symptoms)
    print(f"Total unique symptoms: {len(symptom_list)}")
    
    # Create feature vectors
    X = []
    y = []
    
    for _, row in df.iterrows():
        symptoms = [s.strip().lower() for s in row['Symptoms'].split(',')]
        # Create binary vector for symptoms
        symptom_vector = [1 if symptom in symptoms else 0 for symptom in symptom_list]
        X.append(symptom_vector)
        y.append(row['Disease'])
    
    X = np.array(X)
    y = np.array(y)
    
    print(f"Feature matrix shape: {X.shape}")
    print(f"Target vector shape: {y.shape}")
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Calculate accuracy (on training data for simplicity)
    accuracy = model.score(X, y)
    print(f"Model accuracy: {accuracy * 100:.2f}%")
    
    # Save model data
    model_data = {
        'model': model,
        'symptom_list': symptom_list,
        'disease_data': df
    }
    
    with open('disease_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("Pre-trained model saved as 'disease_model.pkl'")
    
    # Test the model
    test_symptoms = ['fever', 'cough', 'fatigue']
    test_vector = [1 if symptom in test_symptoms else 0 for symptom in symptom_list]
    test_vector = np.array(test_vector).reshape(1, -1)
    
    prediction = model.predict(test_vector)[0]
    probabilities = model.predict_proba(test_vector)[0]
    
    print(f"\nTest prediction:")
    print(f"Input symptoms: {test_symptoms}")
    print(f"Predicted disease: {prediction}")
    
    # Get top 3 predictions
    top_indices = np.argsort(probabilities)[-3:][::-1]
    print(f"Top 3 predictions:")
    for i in top_indices:
        print(f"  {model.classes_[i]}: {probabilities[i]*100:.2f}%")

def main():
    """Main function for deployment"""
    create_pretrained_model()

if __name__ == "__main__":
    main()