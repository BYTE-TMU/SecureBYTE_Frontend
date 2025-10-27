
function ReviewTypeBadge({ reviewType, variant }) {
    
    let color;
    let text;
    if (reviewType === "BLUE") {
        color = blue;
        text = "Security Review";
    } else if (reviewType === "YELLOW") {
        color = yellow;
        text = "Logic Review";
    } else if (reviewType === "GREEN") {
        color = green;
        text = "Test Cases";
    }

    // The 3 variant examples
    if (variant === "withCircle") {
        return (
            <div style={{
                color: color
            }}>
               ● {text}

            </div>
        );

    } else if (variant === "withBorder") {
        return (
            <div style={{
                color: color,
                border: "2px solid" + color,
                borderRadius: "6px", 
            }}>
                {text}
            </div>
        );
    } else if (variant === "withoutText") {
        return (
            <div style={{
                color: color,
                borderRadius: "6px"
            }}></div>

        );

        // For the other types of variants
    } else {
        return (
            <div style={{
                color: color
            }}></div>
        );
    }
}

export default ReviewTypeBadge;