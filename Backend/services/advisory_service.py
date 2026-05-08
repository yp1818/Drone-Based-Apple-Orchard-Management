def get_advisory(disease):
    advisory_map = {
        "apple_scab": {
            "immediate": [
                "Apply copper-based fungicide immediately",
                "Prune heavily infected branches",
                "Remove fallen leaves and debris",
                "Increase air circulation"
            ],
            "short_term": [
                "Repeat fungicide application every 7-10 days",
                "Monitor weather for favorable disease conditions",
                "Improve tree nutrition with foliar feeding",
                "Check for new infections daily"
            ],
            "long_term": [
                "Implement preventive spray schedule",
                "Plant disease-resistant varieties",
                "Maintain proper canopy management",
                "Regular monitoring and assessment"
            ],
            "notes": "Apple Scab can cause significant crop loss if not managed properly. The fungus thrives in wet conditions with moderate temperatures (10-25°C). Focus on both chemical treatment and cultural practices."
        },
        "black_rot": {
            "immediate": [
                "Remove and destroy all mummified fruit",
                "Prune out dead, cankered, or diseased wood",
                "Apply appropriate fungicide immediately",
                "Ensure properly cleaned tools"
            ],
            "short_term": [
                "Maintain scheduled protective fungicide sprays",
                "Assess nearby trees for secondary infections",
                "Improve air flow within the canopy",
                "Avoid overhead irrigation"
            ],
            "long_term": [
                "Burn or bury all infected vegetative material",
                "Adopt rigorous sanitation practices",
                "Consistently prune out dead wood each winter",
                "Monitor tree stress levels"
            ],
            "notes": "Black Rot is a fungal disease that affects fruit, leaves, and bark. The optimal temperature for infection is 80°F. In wet weather, spores are released and spread."
        },
        "cedar_rust": {
            "immediate": [
                "Apply sulfur-based or recommended fungicide",
                "Remove galls from nearby juniper hosts",
                "Protect young leaves and fruit",
                "Inspect orchard edges near windbreaks"
            ],
            "short_term": [
                "Maintain fungicide coverage during wet periods",
                "Continue monitoring nearby host trees",
                "Coordinate sprays with spring rain events",
                "Avoid late pruning"
            ],
            "long_term": [
                "Remove Eastern Red Cedar hosts within 1-2 miles",
                "Transition to rust-resistant apple varieties",
                "Plan annual springtime protective sprays",
                "Implement continuous field scouting"
            ],
            "notes": "Cedar Apple Rust requires two hosts to complete its life cycle: apples/crabapples and Eastern Red Cedar. Removing the alternate host is the most effective long-term strategy."
        },
        "powdery_mildew": {
            "immediate": [
                "Apply potassium bicarbonate or sulfur sprays",
                "Prune off infected white powdery shoots",
                "Improve sunlight penetration in canopy",
                "Reduce nitrogen application if over-fertilized"
            ],
            "short_term": [
                "Reapply fungicide primarily during high humidity",
                "Avoid irrigation practices that wet the foliage",
                "Scout for secondary spread on young leaves",
                "Manage weed competition"
            ],
            "long_term": [
                "Increase tree spacing or prune for open centers",
                "Consider mildew-resistant cultivars for new plantings",
                "Plan dormant pruning to remove infected terminals",
                "Optimize annual nutrient application"
            ],
            "notes": "Powdery Mildew thrives in high humidity but does not require free-standing water to infect. It is worst in crowded canopies with poor air circulation."
        },
        "healthy": {
            "immediate": [
                "No immediate action needed",
                "Maintain standard orchard care",
                "Ensure proper watering schedule",
                "Keep orchard clean of debris"
            ],
            "short_term": [
                "Continue routine weekly scouting",
                "Follow seasonal fertilization plan",
                "Maintain weed control",
                "Prepare for upcoming weather events"
            ],
            "long_term": [
                "Follow standard integrated pest management",
                "Maintain structural pruning schedule",
                "Keep detailed records of orchard health",
                "Optimize soil health and structure"
            ],
            "notes": "The tree appears healthy with no signs of active infection. Continue implementing best practices for standard orchard maintenance and prevention."
        }
    }

    return advisory_map.get(disease, advisory_map["healthy"])