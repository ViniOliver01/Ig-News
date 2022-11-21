import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

interface ActiveLinkProps extends LinkProps{
    children: string;
    activeClassName: string;
}

export default function ActiveLink({children, activeClassName, ...rest}: ActiveLinkProps){
    const {pathname} = useRouter()
    const path = "/"+pathname.split('/')[1]
    
    const className = (path == rest.href ? activeClassName : '')

    return (
    <Link {...rest} className={className}>
        {children}
    </Link>
    );
}