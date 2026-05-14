

export function WarningAppUnderConstruction(props: { custom_message?: string })
{
    return <div style={{
        backgroundColor: "#fff3cd",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ffeeba",
        marginBottom: "16px",
        textAlign: "center",
    }}>
        🚧 {props.custom_message ?? "This section is under construction" } 🚧
    </div>
}
