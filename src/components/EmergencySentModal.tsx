import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmergencyContact } from '../screens/blind/EmergencyScreen';
import { colors, radii, spacing } from '../theme/tokens';
import {
  AmbulanceIcon,
  GuestUserIcon,
  PoliceCarIcon,
} from './AwareIcons';

interface EmergencySentModalProps {
  visible: boolean;
  contacts?: EmergencyContact[];
  onClose: () => void;
}

export const EmergencySentModal: React.FC<EmergencySentModalProps> = ({
  visible,
  contacts = [],
  onClose,
}) => {
  const primaryContact = contacts.find((contact) => contact.enabled) ?? contacts[0];
  const displayContacts = [
    primaryContact
      ? {
          ...primaryContact,
          name: primaryContact.name === 'Josephine' ? 'Josephine DL. Santos' : primaryContact.name,
        }
      : { id: 'default', name: 'Josephine DL. Santos', relation: 'Sister', phone: '09123456789', enabled: true },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            Emergency notifications{'\n'}successfully sent.
          </Text>

          <View style={styles.list}>
            {displayContacts.map((contact) => (
              <View key={contact.id} style={styles.row}>
                <GuestUserIcon size={24} color={colors.sage} />
                <Text style={styles.recipientText}>{contact.name}</Text>
              </View>
            ))}

            <View style={styles.row}>
              <AmbulanceIcon size={24} color={colors.sage} />
              <Text style={styles.recipientText}>Naga City Ambulance</Text>
            </View>

            <View style={styles.row}>
              <PoliceCarIcon size={24} color={colors.sage} />
              <Text style={styles.recipientText}>Naga City Police Office</Text>
            </View>
          </View>

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.backBtnPressed,
            ]}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 28, 40, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: colors.background,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.sage,
    paddingHorizontal: 26,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 17.5,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  list: {
    width: '100%',
    gap: 18,
    marginBottom: 26,
    paddingHorizontal: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recipientText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  backBtn: {
    backgroundColor: colors.navy,
    borderRadius: radii.pill,
    paddingVertical: 11,
    minWidth: 130,
    alignItems: 'center',
  },
  backBtnPressed: {
    opacity: 0.9,
  },
  backBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
