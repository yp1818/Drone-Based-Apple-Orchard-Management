def generate_advisory(disease_name: str) -> dict:
    """
    Automatically generate an advisory dictionary message based on the disease name.
    """
    disease_name_lower = disease_name.lower()
    
    advisory_map = {
        "apple_scab": {
            "immediate": ["Apply copper-based fungicide immediately", "Prune heavily infected branches"],
            "short_term": ["Repeat fungicide application every 7-10 days", "Monitor weather for favorable disease conditions"],
            "long_term": ["Implement preventive spray schedule", "Plant disease-resistant varieties"],
            "notes": "Apple Scab can cause significant crop loss if not managed properly. Focus on both chemical treatment and cultural practices."
        },
        "black_rot": {
            "immediate": ["Remove and destroy all mummified fruit", "Prune out dead, cankered, or diseased wood"],
            "short_term": ["Maintain scheduled protective fungicide sprays", "Improve air flow within the canopy"],
            "long_term": ["Burn or bury all infected vegetative material", "Adopt rigorous sanitation practices"],
            "notes": "Black Rot is a fungal disease. The optimal temperature for infection is 80°F."
        },
        "cedar_rust": {
            "immediate": ["Apply sulfur-based or recommended fungicide", "Remove galls from nearby juniper hosts"],
            "short_term": ["Maintain fungicide coverage during wet periods", "Continue monitoring nearby host trees"],
            "long_term": ["Remove Eastern Red Cedar hosts within 1-2 miles", "Transition to rust-resistant apple varieties"],
            "notes": "Cedar Apple Rust requires two hosts to complete its life cycle."
        },
        "powdery_mildew": {
            "immediate": ["Apply potassium bicarbonate or sulfur sprays", "Prune off infected white powdery shoots"],
            "short_term": ["Reapply fungicide primarily during high humidity", "Manage weed competition"],
            "long_term": ["Increase tree spacing or prune for open centers", "Consider mildew-resistant cultivars for new plantings"],
            "notes": "Powdery Mildew thrives in high humidity but does not require free-standing water to infect."
        },
        "healthy": {
            "immediate": ["No immediate action needed", "Maintain standard orchard care"],
            "short_term": ["Continue routine weekly scouting", "Follow seasonal fertilization plan"],
            "long_term": ["Follow standard integrated pest management", "Maintain structural pruning schedule"],
            "notes": "The tree appears healthy with no signs of active infection."
        }
    }
    
    return advisory_map.get(disease_name_lower, advisory_map["healthy"])


def predict_yield(health_status: str) -> int:
    """
    Predict yield based on health status:
    healthy -> 90
    moderate -> 60
    poor -> 30
    """
    status_lower = health_status.lower()
    if status_lower == "healthy":
        return 90
    elif status_lower == "moderate":
        return 60
    elif status_lower == "poor":
        return 30
    else:
        return 60  # Default to moderate if unknown
