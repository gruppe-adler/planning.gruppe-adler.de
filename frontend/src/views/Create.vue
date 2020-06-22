<template>
    <div class="grad-create">
        <Loader v-if="loading" />
        <Error
            v-else-if="error"
            @button="fetchMaps"
            description="Feler beim Laden der Karten"
            button="Erneut versuchen!"
        />
        <template v-else>
            <div class="grad-create__filter">
                <i class="material-icons">search</i>
                <input type="text" v-model="filter" />
            </div>
            <div class="grad-create__maps-wrapper" v-if="filteredMaps.length > 0">
                <MapItem
                    v-for="m in filteredMaps"
                    :key="m.id"
                    :model="m"
                    @click.native="create(m)"
                />
            </div>
            <Error
                v-else
                @button="fetchMaps"
                description="No maps found"
            />
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { createSession } from '@/services';
import MapItemVue from '@/components/Create/MapItem.vue';
import { fetchMaps, MapMetaData } from '@gruppe-adler/maps-frontend-utils';

type PartialMapMeta = Pick<MapMetaData, 'displayName' | 'worldName' | 'author'>;

@Component({
    components: {
        MapItem: MapItemVue
    }
})
export default class CreateVue extends Vue {
    private maps: PartialMapMeta[] = [];
    private loading: boolean = true;
    private error?: any;
    private filter: string = '';

    private created() {
        this.fetchMaps();
    }

    /**
     * Fetch avaliable maps
     */
    private async fetchMaps() {
        this.loading = true;
        this.error = undefined;

        try {
            this.maps = (await fetchMaps()).sort((a, b) => a.displayName.localeCompare(b.displayName));
        } catch (err) {
            this.error = err;
        }

        this.loading = false;
    }

    private async create(map: PartialMapMeta) {
        const id = await createSession(map.worldName);

        this.$router.push(`/join/${id}`);
    }

    private get filteredMaps(): PartialMapMeta[] {
        const filter = this.filter.toLowerCase();

        return this.maps.filter(m => m.displayName.toLowerCase().includes(filter));
    }
}
</script>

<style lang="scss" scoped>
.grad-create {
    width: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
    overflow: hidden;
    background-color: #f0eeec;

    &__filter {
        position: relative;
        margin: 1rem;
        font-size: 24px;

        > i {
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            width: 2.1em;
            height: auto;
            font-size: 1.5em;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0.5;
        }

        > input {
            color: black;
            background-color: #E3E1DF;
            border-radius: 2.1em;
            padding: 1.5em 2em;
            border: none;
            font-weight: 600;
            outline: none;
            line-height: 1.2em;
            height: auto;
            box-sizing: border-box;
            font-size: 0.75em;
            width: 100%;
            padding-left: 4.2em;
            margin: 0px;
        }
    }

    &__maps-wrapper {
        padding: 1rem;
        display: grid;
        align-content: flex-start;
        justify-items: center;
        flex-shrink: 1;
        overflow-y: auto;
        overflow-x: hidden;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

        &::-webkit-scrollbar-thumb
        {
            background-color: rgba(black, 0.3);
            border-radius: 3px;
        }

    }
}
</style>
