export const metrics = {
    gutter: 20,
    baseline: 10,
};

export const boxPadding = () =>
    `padding: 
        ${metrics.baseline}px 
        ${metrics.gutter}px 
        ${metrics.baseline * 2}px;`;

export const resetLink = () => `    
    text-decoration: none;
    color: inherit;
`;
