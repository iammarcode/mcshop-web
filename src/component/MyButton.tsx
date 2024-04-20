interface MyButtonProps {
    title: string
}

export const MyButton = (title: MyButtonProps) => {
    return (
        <button>{title.title}</button>
    );
}