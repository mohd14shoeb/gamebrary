<template lang="html">
    <div class="add-list">
        <form @submit.prevent="addList" v-if="show">
            <input
                v-model="newListName"
                type="text"
                ref="newListName"
                required
                placeholder="List name"
            />

            <panel class="warning" v-if="isDuplicate" v-html="errorMessage" />

            <div>
                <button
                    type="submit"
                    class="small primary"
                    v-if="!isDuplicate"
                    :disabled="!newListName.length"
                >
                    Create
                </button>

                <button
                    class="small info hollow"
                    type="button"
                    @click="reset"
                >
                    Cancel
                </button>
            </div>
        </form>

        <button class="add small info" @click="toggleAddList" v-else>
            <i class="fas fa-plus" />
        </button>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { swal } from '@/shared/modals';
import Panel from '@/components/Panel/Panel';

export default {
    components: {
        Panel,
    },

    data() {
        return {
            show: false,
            newListName: '',
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),

        errorMessage() {
            return `You already have a list named <strong>${this.newListName}</strong>. Please use a different name.`;
        },

        list() {
            return this.gameLists[this.platform.code];
        },

        isDuplicate() {
            const newListName = this.newListName.toLowerCase();
            // eslint-disable-next-line
            return this.list ?
                this.list.filter(({ name }) => name.toLowerCase() === newListName).length > 0
                : false;
        },
    },

    watch: {
        show() {
            this.$nextTick(() => {
                if (this.$refs.newListName) {
                    this.$refs.newListName.focus();
                }
            });
        },
    },

    methods: {
        toggleAddList() {
            if (!this.show) {
                this.$nextTick(() => {
                    this.$emit('scroll');
                });
            }

            this.show = !this.show;
        },

        addList() {
            this.$store.commit('ADD_LIST', this.newListName);

            this.$ga.event({
                eventCategory: 'list',
                eventAction: 'add',
                eventLabel: 'listAdded',
                eventValue: this.newListName,
            });

            this.$emit('update');
            this.$emit('scroll');
            this.reset();

            swal({
                position: 'bottom-end',
                title: 'List added',
                type: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 1500,
            });
        },

        reset() {
            this.show = false;
            this.newListName = '';
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .add-list {
        padding-right: $gp;
    }

    form {
        border-radius: $border-radius;
        background: $color-light-gray;
        padding: $gp / 2;
        display: flex;
        flex-direction: column;

        input {
            width: 284px;
        }

        button.add {
            margin-right: $gp;
        }
    }

    .panel.warning {
        margin: 0 0 $gp;
    }

    small {
        background: $color-white;
        margin-bottom: $gp / 2;
        display: block;
        padding: $gp / 2;
        border-radius: $border-radius;
    }
</style>
