import React from "react";

interface Props {
    size: string;
}

const DigisosIkonKonvolutt: React.FC<Props> = (props: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={props.size}
            viewBox="0 0 23 16"
            aria-hidden="true"
            pointerEvents="none"
        >
            <title>Konvolutt</title>
            <defs>
                <path
                    id="a_konvolutt"
                    d="M21.083 4C22.14 4 23 4.897 23 6v12c0 1.103-.86 2-1.917 2H1.917C.86 20 0 19.103 0 18V6c0-1.103.86-2 1.917-2h19.166zm.959 14V6c0-.552-.43-1-.959-1H1.917c-.53 0-.959.448-.959 1v12c0 .552.43 1 .959 1h19.166c.53 0 .959-.448.959-1zm-1.994-9.771a.513.513 0 0 1-.142.691l-8.146 5.5a.458.458 0 0 1-.52 0l-8.146-5.5a.513.513 0 0 1-.142-.691.47.47 0 0 1 .662-.149l7.886 5.324 7.886-5.323a.468.468 0 0 1 .662.148zM6.471 13.565a.473.473 0 0 1 .654.187c.13.24.051.545-.179.683l-3.354 2a.466.466 0 0 1-.238.065.479.479 0 0 1-.417-.252.514.514 0 0 1 .18-.683l3.354-2zm13.413 2c.23.138.309.444.179.683a.479.479 0 0 1-.417.252.466.466 0 0 1-.238-.065l-3.354-2a.512.512 0 0 1-.18-.683.471.471 0 0 1 .655-.187l3.355 2z"
                />
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(0 -4)">
                <mask id="b__konvolutt" fill="#fff">
                    <use xlinkHref="#a_konvolutt" />
                </mask>
                <use fill="#3E3832" xlinkHref="#a_konvolutt" />
            </g>
        </svg>
    );
};

export default DigisosIkonKonvolutt;
