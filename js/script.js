document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const inputArea = document.getElementById('input-text');
    const outputArea = document.getElementById('output-text');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const addRuleBtn = document.getElementById('add-rule-btn');
    const rulesContainer = document.getElementById('rules-container');
    const presetSelect = document.getElementById('preset-select');

    // --- State Management ---
    let rules = []; // Rules are now loaded from presets or started empty.

    // --- Functions ---

    /**
     * Renders all rules to the UI from the 'rules' array.
     */
    function renderRules() {
        rulesContainer.innerHTML = '';
        rules.forEach((rule, index) => {
            const ruleEl = document.createElement('div');
            ruleEl.className = 'rule-card bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm';
            ruleEl.dataset.index = index;
            
            const isPaired = rule.type === 'paired';

            ruleEl.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <span class="font-bold text-slate-700 dark:text-slate-300">Rule #${index + 1}</span>
                    <button class="delete-rule-btn text-slate-400 hover:text-red-500 dark:hover:text-red-400">&times; Delete</button>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Rule Type</label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2"><input type="radio" name="type-${index}" value="direct" class="rule-type" ${!isPaired ? 'checked' : ''}> Direct Replace</label>
                        <label class="flex items-center gap-2"><input type="radio" name="type-${index}" value="paired" class="rule-type" ${isPaired ? 'checked' : ''}> Paired Delimiters</label>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="direct-inputs ${isPaired ? 'hidden' : ''}">
                        <label class="block text-sm font-medium text-slate-600 dark:text-slate-400">Find</label>
                        <input type="text" class="find-input w-full mt-1 p-2 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600" value="${escapeHtml(rule.find || '')}">
                    </div>
                    <div class="paired-inputs ${!isPaired ? 'hidden' : ''} flex gap-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-slate-600 dark:text-slate-400">Left Delimiter</label>
                            <input type="text" class="left-delim-input w-full mt-1 p-2 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600" value="${escapeHtml(rule.leftDelim || '')}">
                        </div>
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-slate-600 dark:text-slate-400">Right Delimiter</label>
                            <input type="text" class="right-delim-input w-full mt-1 p-2 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600" value="${escapeHtml(rule.rightDelim || '')}">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-600 dark:text-slate-400">Replace With</label>
                        <input type="text" class="replacement-input w-full mt-1 p-2 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600" placeholder="Use $1 for captured content" value="${escapeHtml(rule.replacement || '')}">
                    </div>
                </div>

                <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 items-center text-sm text-slate-600 dark:text-slate-400">
                     <label class="flex items-center gap-2"><input type="checkbox" class="case-sensitive-checkbox" ${rule.caseSensitive ? 'checked' : ''}> Case Sensitive</label>
                     <label class="direct-option ${isPaired ? 'hidden' : ''} flex items-center gap-2"><input type="checkbox" class="whole-word-checkbox" ${rule.wholeWord ? 'checked' : ''}> Whole Word</label>
                     <label class="paired-option ${!isPaired ? 'hidden' : ''} flex items-center gap-2"><input type="checkbox" class="multiline-checkbox" ${rule.multiline ? 'checked' : ''}> Match across lines</label>
                </div>
            `;
            rulesContainer.appendChild(ruleEl);
        });
    }
    
    /**
     * The core conversion function. It iterates through the rules and applies them.
     */
    function performConversion() {
        let text = inputArea.value;
        rules.forEach(rule => {
            try {
                const regex = buildRegexForRule(rule);
                if (!regex) return;
                const replacement = rule.replacement.replace(/\$1/g, '$$1');
                text = text.replace(regex, replacement);
            } catch (e) {
                console.error("Failed to build or apply a rule:", rule, e);
            }
        });
        outputArea.value = text;
    }

    /**
     * Builds a RegExp object from a rule configuration.
     * @param {object} rule The rule object.
     * @returns {RegExp|null} A RegExp object or null if the rule is invalid.
     */
    function buildRegexForRule(rule) {
        let patternStr = '';
        let flags = 'g' + (rule.caseSensitive ? '' : 'i') + (rule.multiline ? 's' : '');

        if (rule.type === 'paired') {
            if (!rule.leftDelim || !rule.rightDelim) return null;
            if (rule.isDefault && rule.leftDelim === '$' && rule.rightDelim === '$') {
                 return /(?<!\$)\$([^\$]+?)\$(?!\$)/g; // Special case for single '$'
            }
            const left = escapeRegex(rule.leftDelim);
            const right = escapeRegex(rule.rightDelim);
            patternStr = `${left}(.*?)${right}`;
        } else { // direct
            if (!rule.find) return null;
            patternStr = escapeRegex(rule.find);
            if (rule.wholeWord) {
                patternStr = `\\b${patternStr}\\b`;
            }
        }
        return new RegExp(patternStr, flags);
    }

    /**
     * Loads presets into the dropdown menu.
     */
    function loadPresets() {
        presetSelect.innerHTML = '<option value="custom">-- Custom Rules --</option>';
        for (const key in presets) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = presets[key].name;
            presetSelect.appendChild(option);
        }
    }
    
    /**
     * Handles the selection of a preset.
     * @param {string} presetKey The key of the preset in the 'presets' object.
     */
    function handlePresetChange(presetKey) {
        if (presetKey === 'custom' || !presets[presetKey]) {
            rules = [];
        } else {
            // Deep copy the rules to avoid modifying the original preset object
            rules = JSON.parse(JSON.stringify(presets[presetKey].rules));
        }
        renderRules();
    }

    // --- Event Handlers ---
    
    rulesContainer.addEventListener('input', e => {
        const target = e.target;
        const ruleCard = target.closest('.rule-card');
        if (!ruleCard) return;
        const index = parseInt(ruleCard.dataset.index, 10);
        const rule = rules[index];

        if (target.classList.contains('find-input')) rule.find = target.value;
        if (target.classList.contains('replacement-input')) rule.replacement = target.value;
        if (target.classList.contains('left-delim-input')) rule.leftDelim = target.value;
        if (target.classList.contains('right-delim-input')) rule.rightDelim = target.value;
    });

    rulesContainer.addEventListener('change', e => {
        const target = e.target;
        const ruleCard = target.closest('.rule-card');
        if (!ruleCard) return;
        const index = parseInt(ruleCard.dataset.index, 10);
        const rule = rules[index];

        if (target.classList.contains('rule-type')) {
            rule.type = target.value;
            renderRules();
        }
        if (target.classList.contains('case-sensitive-checkbox')) rule.caseSensitive = target.checked;
        if (target.classList.contains('whole-word-checkbox')) rule.wholeWord = target.checked;
        if (target.classList.contains('multiline-checkbox')) rule.multiline = target.checked;
    });
    
    rulesContainer.addEventListener('click', e => {
        if (e.target.classList.contains('delete-rule-btn') || e.target.parentElement.classList.contains('delete-rule-btn')) {
            const ruleCard = e.target.closest('.rule-card');
            const index = parseInt(ruleCard.dataset.index, 10);
            rules.splice(index, 1);
            presetSelect.value = 'custom'; // Switch to custom mode after modification
            renderRules();
        }
    });

    addRuleBtn.addEventListener('click', () => {
        rules.push({
            type: 'direct', find: '', replacement: '',
            caseSensitive: true, wholeWord: false, multiline: false
        });
        presetSelect.value = 'custom';
        renderRules();
    });
    
    presetSelect.addEventListener('change', (e) => handlePresetChange(e.target.value));

    // --- Helper Functions ---
    function escapeRegex(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function escapeHtml(unsafe) { return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    
    function copyToClipboard() {
        if (!outputArea.value) { updateCopyButtonState('Nothing to copy', true); return; }
        navigator.clipboard.writeText(outputArea.value).then(() => updateCopyButtonState('Copied!', false), () => updateCopyButtonState('Copy failed', true));
    }
    
    function updateCopyButtonState(text, isError) {
        const originalText = 'Copy Results';
        const originalClasses = copyBtn.className;
        copyBtn.textContent = text;
        copyBtn.className = isError 
            ? 'w-full sm:w-auto btn font-bold py-3 px-8 rounded-lg bg-red-500 text-white'
            : 'w-full sm:w-auto btn font-bold py-3 px-8 rounded-lg bg-green-500 text-white';
        setTimeout(() => { copyBtn.textContent = originalText; copyBtn.className = originalClasses; }, 2000);
    }
    
    function clearContent() { inputArea.value = ''; outputArea.value = ''; }

    // --- Initial Setup ---
    convertBtn.addEventListener('click', performConversion);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearContent);
    
    loadPresets();
    presetSelect.value = 'markup-markdown-katex'; // Load the default preset on start
    handlePresetChange(presetSelect.value);
});
