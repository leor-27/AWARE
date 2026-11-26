import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  GuestUserIcon,
  ShieldCheckIcon,
  SlidersIcon,
  TrashIcon,
} from '../../components/AwareIcons';
import { colors, radii, spacing } from '../../theme/tokens';
import { FeedbackPreferences, speakCue, triggerHaptic } from '../../utils/feedback';

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  enabled: boolean;
}

type ContactSubView = 'list' | 'add' | 'edit' | 'delete' | 'permissions';

interface EmergencyScreenProps {
  feedbackPrefs: FeedbackPreferences;
  contacts: EmergencyContact[];
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
  onBackToSos: () => void;
}

function getPronounForRelation(relation: string): 'She' | 'He' | 'They' {
  const lower = relation.toLowerCase();
  if (
    lower.includes('sister') ||
    lower.includes('mother') ||
    lower.includes('mom') ||
    lower.includes('wife') ||
    lower.includes('daughter') ||
    lower.includes('aunt')
  ) {
    return 'She';
  }
  if (
    lower.includes('father') ||
    lower.includes('dad') ||
    lower.includes('brother') ||
    lower.includes('husband') ||
    lower.includes('son') ||
    lower.includes('uncle')
  ) {
    return 'He';
  }
  return 'They';
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  feedbackPrefs,
  contacts,
  onUpdateContacts,
  onBackToSos,
}) => {
  const [subView, setSubView] = useState<ContactSubView>('list');
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftPhone, setDraftPhone] = useState('');
  const [draftRelation, setDraftRelation] = useState('');
  const [permissionsChecked, setPermissionsChecked] = useState(false);

  const editingContact =
    contacts.find((c) => c.id === editingContactId) ?? null;

  const openAdd = () => {
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    setDraftName('');
    setDraftPhone('');
    setDraftRelation('');
    setEditingContactId(null);
    setSubView('add');
    speakCue('Add emergency contact. Enter a trusted person details.', feedbackPrefs);
  };

  const openEdit = (contact: EmergencyContact) => {
    triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
    setEditingContactId(contact.id);
    setDraftName(contact.name);
    setDraftPhone(contact.phone);
    setDraftRelation(contact.relation);
    setSubView('edit');
    speakCue(`Edit contact ${contact.name}.`, feedbackPrefs);
  };

  const handleSaveNew = () => {
    if (!draftName.trim() || !draftPhone.trim()) return;
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    const cleanedPhone = draftPhone.trim();
    const next: EmergencyContact = {
      id: String(Date.now()),
      name: draftName.trim(),
      phone: cleanedPhone,
      relation: draftRelation.trim() || 'Trusted Contact',
      enabled: true,
    };
    onUpdateContacts([...contacts, next]);
    setSubView('list');
    speakCue(`${next.name} saved to emergency contacts.`, feedbackPrefs);
  };

  const handleSaveEdit = () => {
    if (!editingContact || !draftName.trim() || !draftPhone.trim()) return;
    triggerHaptic('success', feedbackPrefs.hapticsEnabled);
    onUpdateContacts(
      contacts.map((c) =>
        c.id === editingContact.id
          ? {
              ...c,
              name: draftName.trim(),
              phone: draftPhone.trim(),
              relation: draftRelation.trim() || c.relation,
            }
          : c
      )
    );
    setSubView('list');
    speakCue(`${draftName.trim()} updated.`, feedbackPrefs);
  };

  const handleConfirmDelete = () => {
    if (!editingContact) return;
    triggerHaptic('warning', feedbackPrefs.hapticsEnabled);
    const removedName = editingContact.name;
    onUpdateContacts(contacts.filter((c) => c.id !== editingContact.id));
    setEditingContactId(null);
    setSubView('list');
    speakCue(`${removedName} deleted from emergency contacts.`, feedbackPrefs);
  };

  /* 1. ADD EMERGENCY CONTACT */
  if (subView === 'add') {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topIconTile}>
          <GuestUserIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Add emergency contact</Text>
        <Text style={styles.subheading}>Enter a trusted person’s details.</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full name</Text>
          <View style={styles.inputPill}>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Enter full name"
              placeholderTextColor={colors.sage}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Mobile number</Text>
          <View style={styles.inputPill}>
            <Text style={styles.phonePrefix}>+63  •</Text>
            <TextInput
              value={draftPhone}
              onChangeText={setDraftPhone}
              placeholder="Enter mobile number"
              placeholderTextColor={colors.sage}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Relationship / role</Text>
          <View style={styles.inputPill}>
            <TextInput
              value={draftRelation}
              onChangeText={setDraftRelation}
              placeholder="Family, caregiver or responder"
              placeholderTextColor={colors.sage}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.actionsStack}>
          <Pressable onPress={handleSaveNew} style={styles.navyPillBtn}>
            <Text style={styles.navyPillBtnText}>Save contact</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setSubView('list');
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 2. EDIT CONTACT */
  if (subView === 'edit' && editingContact) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topIconTile}>
          <GuestUserIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Edit contact</Text>
        <Text style={styles.subheading}>
          Update {editingContact.name}’s details.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full name</Text>
          <View style={styles.inputPill}>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Enter full name"
              placeholderTextColor={colors.sage}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Mobile number</Text>
          <View style={styles.inputPill}>
            <TextInput
              value={draftPhone}
              onChangeText={setDraftPhone}
              placeholder="Enter mobile number"
              placeholderTextColor={colors.sage}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Relationship / role</Text>
          <View style={styles.inputPill}>
            <TextInput
              value={draftRelation}
              onChangeText={setDraftRelation}
              placeholder="Family, caregiver or responder"
              placeholderTextColor={colors.sage}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.actionsStack}>
          <Pressable onPress={handleSaveEdit} style={styles.navyPillBtn}>
            <Text style={styles.navyPillBtnText}>Save changes</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              triggerHaptic('warning', feedbackPrefs.hapticsEnabled);
              setSubView('delete');
            }}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillBtnText}>Delete contact</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setSubView('list');
            }}
            style={styles.outlinePillBtn}
          >
            <Text style={styles.outlinePillBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 3. DELETE CONTACT CONFIRMATION */
  if (subView === 'delete' && editingContact) {
    const remaining = contacts.filter((c) => c.id !== editingContact.id);
    const pronoun = getPronounForRelation(editingContact.relation);

    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <TrashIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>Delete {editingContact.name}?</Text>
        <Text style={styles.subheading}>
          {pronoun} will no longer receive your SOS.
        </Text>

        <View style={styles.sageCard}>
          <View style={styles.cardHeaderLine}>
            <GuestUserIcon size={20} color={colors.sage} />
            <Text style={styles.cardNameText}>
              {remaining.length === 0
                ? 'No contacts will remain'
                : remaining.length === 1
                ? '1 contact will remain'
                : `${remaining.length} contacts will remain`}
            </Text>
          </View>

          {remaining.length > 0 ? (
            remaining.map((c) => (
              <Text key={c.id} style={styles.cardMetaText}>
                {c.name} - {c.relation}
              </Text>
            ))
          ) : (
            <Text style={styles.cardMetaText}>
              You can add a new contact anytime in SOS setup.
            </Text>
          )}
        </View>

        <View style={styles.actionsStack}>
          <Pressable
            onPress={() => {
              triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
              setSubView('list');
            }}
            style={styles.navyPillBtn}
          >
            <Text style={styles.navyPillBtnText}>Keep contact</Text>
          </Pressable>

          <Pressable
            onPress={handleConfirmDelete}
            style={styles.dangerPillBtn}
          >
            <Text style={styles.dangerPillBtnText}>
              Delete {editingContact.name}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  /* 4. SOS SETUP (EMPTY STATE — 0 CONTACTS) */
  if (contacts.length === 0) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topIconTile}>
          <ShieldCheckIcon size={22} color={colors.sage} />
        </View>

        <Text style={styles.heading}>SOS setup</Text>
        <Text style={styles.subheading}>No emergency contacts are saved.</Text>

        <View style={styles.blueOutlineCard}>
          <View style={styles.cardHeaderLine}>
            <GuestUserIcon size={20} color={colors.sage} />
            <Text style={styles.cardNameText}>Save a trusted contact</Text>
          </View>
          <Text style={styles.setupCardBody}>
            AWARE needs someone to send your emergency message to.
          </Text>
        </View>

        <Pressable onPress={openAdd} style={styles.navyPillBtn}>
          <Text style={styles.navyPillBtnText}>Add emergency contact</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            triggerHaptic('success', feedbackPrefs.hapticsEnabled);
            setPermissionsChecked(true);
            speakCue('SMS and location permissions are enabled.', feedbackPrefs);
          }}
          style={styles.sageCard}
        >
          <View style={styles.cardHeaderLine}>
            <SlidersIcon size={20} color={colors.sage} />
            <Text style={styles.cardNameText}>Check your permissions</Text>
          </View>
          <Text style={styles.setupCardBody}>
            {permissionsChecked
              ? 'SMS and location access active. Primary SIM ready.'
              : 'Allow SMS and location access. Choose a sending SIM.'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
            onBackToSos();
          }}
          style={styles.outlinePillBtn}
        >
          <Text style={styles.outlinePillBtnText}>Back to SOS</Text>
        </Pressable>
      </ScrollView>
    );
  }

  /* 5. EMERGENCY CONTACTS LIST (1+ CONTACTS) */
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => {
          if (contacts.length === 1) {
            setEditingContactId(contacts[0].id);
            setSubView('delete');
          }
        }}
        style={styles.topIconTile}
        accessibilityLabel={
          contacts.length === 1 ? `Delete ${contacts[0].name}` : 'Contacts'
        }
      >
        {contacts.length === 1 ? (
          <TrashIcon size={22} color={colors.sage} />
        ) : (
          <GuestUserIcon size={22} color={colors.sage} />
        )}
      </Pressable>

      <Text style={styles.heading}>Emergency contacts</Text>
      <Text style={styles.subheading}>Only saved contacts receive your SOS.</Text>

      <View style={styles.cardsList}>
        {contacts.map((contact) => (
          <View key={contact.id} style={styles.sageCard}>
            <View style={styles.cardHeaderLine}>
              <GuestUserIcon size={20} color={colors.sage} />
              <Text style={styles.cardNameText}>{contact.name}</Text>
            </View>
            <Text style={styles.cardMetaText}>
              {contact.relation} • {contact.phone}
            </Text>

            <Pressable
              onPress={() => openEdit(contact)}
              style={styles.sageEditBtn}
            >
              <Text style={styles.sageEditBtnText}>Edit {contact.name}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.actionsStack}>
        <Pressable onPress={openAdd} style={styles.navyPillBtn}>
          <Text style={styles.navyPillBtnText}>Add emergency contact</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            triggerHaptic('tap', feedbackPrefs.hapticsEnabled);
            onBackToSos();
          }}
          style={styles.outlinePillBtn}
        >
          <Text style={styles.outlinePillBtnText}>Back to SOS</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: 14,
  },
  topIconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DDE3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: -6,
    marginBottom: 4,
  },
  cardsList: {
    gap: 14,
  },
  sageCard: {
    borderWidth: 1.8,
    borderColor: colors.sage,
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.45)',
    gap: 8,
  },
  blueOutlineCard: {
    borderWidth: 1.8,
    borderColor: colors.navy,
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.45)',
    gap: 8,
  },
  cardHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardNameText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  cardMetaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  setupCardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  sageEditBtn: {
    backgroundColor: '#6D8074',
    borderRadius: radii.pill,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  sageEditBtnText: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '500',
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14.5,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.3,
    borderColor: colors.sage,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.65)',
    gap: 8,
  },
  phonePrefix: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  actionsStack: {
    gap: 11,
    marginTop: 4,
  },
  navyPillBtn: {
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navyPillBtnText: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '600',
  },
  dangerPillBtn: {
    backgroundColor: '#B52A2A',
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerPillBtnText: {
    color: colors.white,
    fontSize: 13.5,
    fontWeight: '600',
  },
  outlinePillBtn: {
    borderWidth: 1.4,
    borderColor: colors.sage,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  outlinePillBtnText: {
    color: colors.navy,
    fontSize: 13.5,
    fontWeight: '600',
  },
});
