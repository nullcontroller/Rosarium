/** Ordered article identities, independent from physical placement and titles. */
export const aiKnowledgeGroups = [
 {id:'probability-generation',title:'確率・生成原理',ids:['conditional-probability','temperature-design','hallucination-mechanisms']},
 {id:'learning-theory',title:'学習理論',ids:['language-model-loss','policy-gradient-learning','preference-learning-dpo','verifiable-reward-reasoning','compute-optimal-scaling']},
 {id:'model-computation',title:'モデルの計算構造',ids:['attention-information-flow','in-context-learning','mixture-of-experts','state-space-sequence-models','diffusion-language-models']},
 {id:'inference-efficiency',title:'推論・計算効率',ids:['attention-efficiency','test-time-compute-allocation','speculative-decoding']},
 {id:'interpretation-limits',title:'解釈・理論的限界',ids:['mechanistic-interpretability','transformer-computational-limits','neural-symbolic-proof']},
].map(group => ({...group,ids:group.ids.map(slug => `foundations/${slug}`)}));
