export const metrics = {
    gutter: 20,
    baseline: 10,
};

export const webpageLike = (allowWebpageUI: boolean) => `
    user-select: ${allowWebpageUI ? 'text' : 'none'};
    -webkit-tap-highlight-color: ${
        allowWebpageUI ? 'default' : `rgba(255,255,255,.5)`
    };
`;

export const boxPadding = () =>
    `padding: 
        ${metrics.baseline}px 
        ${metrics.gutter}px 
        ${metrics.baseline * 2}px;`;

export const resetLink = () => `    
    text-decoration: none;
    color: inherit;
`;
