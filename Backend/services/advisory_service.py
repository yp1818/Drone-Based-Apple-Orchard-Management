def get_advisory(disease):
    advisory_map = {
        "apple_scab": "Use fungicide spray",
        "black_rot": "Remove infected parts",
        "cedar_rust": "Apply sulfur spray",
        "powdery_mildew": "Use potassium bicarbonate",
        "healthy": "No action needed"
    }

    return advisory_map.get(disease, "No advisory available")