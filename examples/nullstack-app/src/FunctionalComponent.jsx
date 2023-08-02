
export default function FunctionalComponent(context) {
    console.log("Context from inside functional component: ", context)
    return <div>
        This is a functional component!
        I have these keys in my context: {Object.keys(context).join(', ')}
    </div>
};
