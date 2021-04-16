<script context="module">
    import * as EditorFeature from "./features/editor.feature.svelte";
    import * as ItemFeature from "./features/item.feature.svelte";
    import * as RoleFeature from "./features/role.feature.svelte";
    import * as MapFeature from "./features/map.feature.svelte";
    import * as SkillFeature from "./features/skill.feature.svelte";
    import * as TimelineFeature from "./features/timeline.feature.svelte";
    import * as ConfigFeature from "./features/config.feature.svelte";

    const features = [
        EditorFeature,
        ItemFeature,
        RoleFeature,
        MapFeature,
        SkillFeature,
        TimelineFeature,
        ConfigFeature,
    ];

    export const getTopFeatures = (keys = []) => {
        const result = [];
        features.forEach(({ definitions }) => {
            const { unique, shortname, sort, tab, top, extra } = definitions;
            if (extra) {
                return;
            }
            if (top || (tab && keys.includes(unique))) {
                result.push({ unique, shortname, sort });
            }
        });
        return result.sort((a, b) => a.sort - b.sort);
    };

    export const getFeatureComponent = (unique) => {
        for (let { definitions, default: component } of features) {
            if (definitions.unique === unique) {
                return component;
            }
        }
        throw new Error(`没有相应的组件（${unique}）。`);
    };

    export const getSampleFeatures = (keys = []) => {
        const result = [];
        features.forEach(({ definitions }) => {
            const { unique, shortname, sort, tab } = definitions;
            if (tab && keys.includes(unique)) {
                result.push({ name: shortname, unique, sort });
            }
        });
        return result.sort((a, b) => a.sort - b.sort);
    };

    export const getSampleFeature = (unique) => {
        for (let { definitions } of features) {
            if (definitions.unique === unique) {
                return { name: definitions.shortname };
            }
        }
        throw new Error(`没有相应的组件（${unique}）。`);
    };
</script>
