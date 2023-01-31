import React,{useState , useRef , useMemo , useEffect} from 'react'

const useElemntOnScreen = (options, targetRef) => {
    const [isVisible , setIsVisible] = useState(false);

    const callBackFunction = entries => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting); 
    }

    const optionsMemo = useMemo(() => {
        return options
    },[options]);

    useEffect(() => {
        const observer = new IntersectionObserver(callBackFunction , optionsMemo);
        const currentTagert = targetRef.current;
        if(currentTagert) observer.observe(currentTagert);

        return () => {
            if(currentTagert) observer.unobserve(currentTagert);
        }
    }, [targetRef , optionsMemo]);

    return isVisible
}

export default useElemntOnScreen;